import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlug } from './get-questions-by-slug'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlug

describe('Get Question By Slug', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		sut = new GetQuestionBySlug(questionsRepository)
	})

	test('should be able to get a question by slug', async () => {
		const newQuestion = Question.create({
			title: 'Example question',
			content: 'Example content',
			authorId: new UniqueEntityID('1'),
			slug: Slug.create('example-question')
		})

		questionsRepository.create(newQuestion)

		const { question } = await sut.execute({
			slug: 'example-question'
		})

		expect(question.id).toBeTruthy()
		expect(questionsRepository.items[0].id).toEqual(question.id)
	})
})
