import { CommentaryNotFoundException } from '@/core/errors/CommentaryNotFoundException'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowed } from '@/core/errors/NotAllowed'

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
		if(!answerComment) throw new CommentaryNotFoundException()

		if(authorId !== answerComment.authorId.toString()) throw new NotAllowed()

		await this.answerCommentsRepository.delete(answerComment)
	}
}