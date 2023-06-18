import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		sut = new DeleteQuestionUseCase(questionsRepository)
	})

	test('should be able to delete a question', async () => {
		const newQuestion = makeQuestion({}, new UniqueEntityID('question-1'))

		questionsRepository.create(newQuestion)

		await sut.execute({ questionId: 'question-1' })

		expect(questionsRepository.items).toHaveLength(0)
	})
})
