import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'

let answersRepository: AnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
	beforeEach(() => {
		answersRepository = new InMemoryAnswerRepository()
		sut = new AnswerQuestionUseCase(answersRepository)
	})

	test('should be able to create an answer', async () => {
		const { answer } = await sut.execute({
			content: 'Nova resposta',
			questionId: '1',
			instructorId: '1'
		})
  
		expect(answer.id).toBeTruthy()
	})
})