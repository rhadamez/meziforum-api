import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string
	answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<string, object>

export class DeleteAnswerComment {
	constructor(
    private answerCommentsRepository: AnswerCommentsRepository
	) { }

	async execute({ authorId, answerCommentId }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment = await this.answerCommentsRepository.findById(answerCommentId)
		if(!answerComment) return left('Comment not found on this answer.')

		if(authorId !== answerComment.authorId.toString()) return left('Not allowed.')

		await this.answerCommentsRepository.delete(answerComment)

		return right({})
	}
}