import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowed } from '@/core/errors/NotAllowed'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		sut = new EditQuestionUseCase(questionsRepository)
	})

	test('should be able to edit a question', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('question-1'))

		await questionsRepository.create(newQuestion)

		await sut.execute({
			authorId: 'author-1',
			questionId: newQuestion.id.toString(),
			title: 'updated-title',
			content: 'updated-content'
		})

		expect(questionsRepository.items[0]).toMatchObject({
			title: 'updated-title',
			content: 'updated-content'
		})
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
				content: 'updated-content'
			})
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
