import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'

let answerRepository: InMemoryAnswerRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
	beforeEach(() => {
		answerRepository = new InMemoryAnswerRepository()
		questionsRepository = new InMemoryQuestionsRepository()
		sut = new ChooseQuestionBestAnswerUseCase(questionsRepository, answerRepository)
	})

	test('should be able to set best answer to a question', async () => {
		const question = makeQuestion()
		const newAnswer = makeAnswer({ questionId: question.id, authorId: question.authorId })

		await questionsRepository.create(question)
		await answerRepository.create(newAnswer)

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: question.authorId.toString() })
		expect(questionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id)
	})

	test('should not be able to set best answer to a question as a non author', async () => {
		const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
		const answer = makeAnswer({ questionId: question.id, authorId: new UniqueEntityID('author-2') })

		await questionsRepository.create(question)

		await answerRepository.create(answer)

		expect(() => {
			return sut.execute({
				answerId: answer.id.toString(),
				authorId: answer.authorId.toString() })
		}).rejects.toBeInstanceOf(Error)
	})

})
