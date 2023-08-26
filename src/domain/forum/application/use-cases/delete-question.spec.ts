import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from './delete-question'
import { NotAllowed } from '@/core/errors/NotAllowed'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
		sut = new DeleteQuestionUseCase(questionsRepository)
	})

	test('should be able to delete a question', async () => {
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

		await sut.execute({ authorId: 'author-1', questionId: 'question-1' })

		expect(questionsRepository.items).toHaveLength(0)
		expect(questionAttachmentsRepository.items).toHaveLength(0)
	})

	test('should not be able to delete a question from a non author user', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('question-1'))

		await questionsRepository.create(newQuestion)

		expect(() => {
			return sut.execute({ authorId: 'author-2', questionId: 'question-1' })
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
