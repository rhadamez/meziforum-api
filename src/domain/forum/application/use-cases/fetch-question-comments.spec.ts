import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentssUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentssUseCase

describe('Fetch Recent Questions', () => {
	beforeEach(() => {
		questionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new FetchQuestionCommentssUseCase(questionCommentsRepository)
	})

	test('should be able to fetch comments from a question', async () => {
		const questionId = new UniqueEntityID('question-1')
		questionCommentsRepository.create(makeQuestionComment({ questionId, createdAt: new Date(2023, 0, 20) }))
		questionCommentsRepository.create(makeQuestionComment({ questionId, createdAt: new Date(2022, 0, 20) }))
		questionCommentsRepository.create(makeQuestionComment({ questionId, createdAt: new Date(2021, 0, 20) }))

		const { questionComments } = await sut.execute({ questionId: questionId.toString(), page: 1 })

		expect(questionComments).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2021, 0, 20) })
		])
	})

	test('should be able to fetch paginated recent answer', async () => {
		const questionId = new UniqueEntityID('question-1')

		await questionCommentsRepository.create(makeQuestionComment({}, questionId))

		for(let i = 1; i<=22; i++) {
			questionCommentsRepository.create(makeQuestionComment({ questionId }))
		}

		const { questionComments } = await sut.execute({ questionId: questionId.toString(), page: 2 })

		expect(questionComments).toHaveLength(2)
	})
})
