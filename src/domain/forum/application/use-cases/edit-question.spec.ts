import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowed } from '@/core/errors/NotAllowed'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		sut = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository)
	})

	test('should be able to edit a question', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('question-1'))

		await questionsRepository.create(newQuestion)

		questionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('1')
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('2')
			})
		)

		await sut.execute({
			authorId: 'author-1',
			questionId: newQuestion.id.toString(),
			title: 'updated-title',
			content: 'updated-content',
			attachmentsIds: ['1', '3']
		})

		expect(questionsRepository.items[0]).toMatchObject({
			title: 'updated-title',
			content: 'updated-content'
		})
		expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(questionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
		])
	})

	test('should not be able to edit a question from a non author user', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('question-1'))

		await questionsRepository.create(newQuestion)

		expect(() => {
			return sut.execute({
				authorId: 'author-2',
				questionId: 'question-1',
				title: 'updated-title',
				content: 'updated-content',
				attachmentsIds: []
			})
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
