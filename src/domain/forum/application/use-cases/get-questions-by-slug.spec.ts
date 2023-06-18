import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlug } from './get-questions-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlug

describe('Get Question By Slug', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		sut = new GetQuestionBySlug(questionsRepository)
	})

	test('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('example-question')
		})

		questionsRepository.create(newQuestion)

		const { question } = await sut.execute({
			slug: 'example-question'
		})

		expect(question.id).toBeTruthy()
		expect(question.title).toEqual(newQuestion.title)
	})
})
