import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentssUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentssUseCase

describe('Fetch Recent Answers', () => {
	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new FetchAnswerCommentssUseCase(answerCommentsRepository)
	})

	test('should be able to fetch comments from a answer', async () => {
		const answerId = new UniqueEntityID('answer-1')
		answerCommentsRepository.create(makeAnswerComment({ answerId, createdAt: new Date(2023, 0, 20) }))
		answerCommentsRepository.create(makeAnswerComment({ answerId, createdAt: new Date(2022, 0, 20) }))
		answerCommentsRepository.create(makeAnswerComment({ answerId, createdAt: new Date(2021, 0, 20) }))

		const { answerComments } = await sut.execute({ answerId: answerId.toString(), page: 1 })

		expect(answerComments).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2021, 0, 20) })
		])
	})

	test('should be able to fetch paginated recent answer', async () => {
		const answerId = new UniqueEntityID('answer-1')

		await answerCommentsRepository.create(makeAnswerComment({}, answerId))

		for(let i = 1; i<=22; i++) {
			answerCommentsRepository.create(makeAnswerComment({ answerId }))
		}

		const { answerComments } = await sut.execute({ answerId: answerId.toString(), page: 2 })

		expect(answerComments).toHaveLength(2)
	})
})
