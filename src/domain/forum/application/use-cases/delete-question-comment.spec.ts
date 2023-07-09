import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionComment } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/NotAllowed'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionComment

describe('Delete Question Comment', () => {
	beforeEach(() => {
		questionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new DeleteQuestionComment(questionCommentsRepository)
	})

	test('should be able to delete a comment from a question', async () => {
		const questionComment = makeQuestionComment()

		await questionCommentsRepository.create(questionComment)

		await sut.execute({
			authorId: questionComment.authorId.toString(),
			questionCommentId: questionComment.id.toString()
		})

		expect(questionCommentsRepository.items).toHaveLength(0)
	})

	test('should not be able to delete a comment from a question with a non author user', async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityID('author-1')
		})

		await questionCommentsRepository.create(questionComment)

		expect(() => {
			return sut.execute({
				authorId: 'author-2',
				questionCommentId: questionComment.id.toString()
			})
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
