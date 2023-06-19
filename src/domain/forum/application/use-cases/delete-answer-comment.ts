import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string
	answerCommentId: string
}

export class DeleteAnswerComment {
	constructor(
    private answerCommentsRepository: AnswerCommentsRepository
	) { }

	async execute({ authorId, answerCommentId }: DeleteAnswerCommentUseCaseRequest): Promise<void> {
		const answerComment = await this.answerCommentsRepository.findById(answerCommentId)
		if(!answerComment) throw new Error('Comment not found on this answer.')

		if(authorId !== answerComment.authorId.toString()) throw new Error('Not allowed.')

		await this.answerCommentsRepository.delete(answerComment)
	}
}