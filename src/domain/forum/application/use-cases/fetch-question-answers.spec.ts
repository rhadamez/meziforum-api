import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchQuestionAnswerssUseCase } from './fetch-question-answers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswerssUseCase

describe('Fetch Recent Questions', () => {
	beforeEach(() => {
		const questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)

		const answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		answersRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
		sut = new FetchQuestionAnswerssUseCase(answersRepository)
	})

	test('should be able to fetch recent answers', async () => {
		const questionId = new UniqueEntityID('question-1')
		answersRepository.create(makeAnswer({ questionId, createdAt: new Date(2023, 0, 20) }))
		answersRepository.create(makeAnswer({ questionId, createdAt: new Date(2022, 0, 20) }))
		answersRepository.create(makeAnswer({ questionId, createdAt: new Date(2021, 0, 20) }))

		const { answers } = await sut.execute({ questionId: questionId.toString(), page: 1 })

		expect(answers).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2021, 0, 20) })
		])
	})

	test('should be able to fetch paginated recent answer', async () => {
		const questionId = new UniqueEntityID('question-1')

		await questionsRepository.create(makeQuestion({}, questionId))

		for(let i = 1; i<=22; i++) {
			answersRepository.create(makeAnswer({ questionId }))
		}

		const { answers } = await sut.execute({ questionId: questionId.toString(), page: 2 })

		expect(answers).toHaveLength(2)
	})
})
