import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionComment } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

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
})
