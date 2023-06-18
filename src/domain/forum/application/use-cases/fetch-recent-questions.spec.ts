import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentTopicsUseCase } from './fetch-recent-questions'

let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentTopicsUseCase

describe('Fetch Recent Questions', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		sut = new FetchRecentTopicsUseCase(questionsRepository)
	})

	test('should be able to fetch recent questions', async () => {
		questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 20) }))
		questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }))
		questionsRepository.create(makeQuestion({ createdAt: new Date(2021, 0, 20) }))

		const { questions } = await sut.execute({ page: 1 })

		expect(questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2021, 0, 20) })
		])
	})

	test('should be able to fetch paginated recent questions', async () => {
		for(let i = 1; i<=22; i++) {
			questionsRepository.create(makeQuestion())
		}

		const { questions } = await sut.execute({ page: 2 })

		expect(questions).toHaveLength(2)
	})
})
