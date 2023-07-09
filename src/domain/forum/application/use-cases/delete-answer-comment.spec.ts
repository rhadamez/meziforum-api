import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerComment } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/NotAllowed'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerComment

describe('Delete Answer Comment', () => {
	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new DeleteAnswerComment(answerCommentsRepository)
	})

	test('should be able to delete a comment from a answer', async () => {
		const answerComment = makeAnswerComment()

		await answerCommentsRepository.create(answerComment)

		await sut.execute({
			authorId: answerComment.authorId.toString(),
			answerCommentId: answerComment.id.toString()
		})

		expect(answerCommentsRepository.items).toHaveLength(0)
	})

	test('should not be able to delete a comment from a answer with a non author user', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID('author-1')
		})

		await answerCommentsRepository.create(answerComment)

		expect(() => {
			return sut.execute({
				authorId: 'author-2',
				answerCommentId: answerComment.id.toString()
			})
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
