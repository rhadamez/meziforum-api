import { NotAllowed } from '@/core/errors/NotAllowed'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { CommentaryNotFoundException } from '@/core/errors/CommentaryNotFoundException'

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string
	questionCommentId: string
}

export class DeleteQuestionComment {
	constructor(
    private questionCommentsRepository: QuestionCommentsRepository
	) { }

	async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<void> {
		const questionComment = await this.questionCommentsRepository.findById(questionCommentId)
		if(!questionComment) throw new CommentaryNotFoundException()

		if(authorId !== questionComment.authorId.toString()) throw new NotAllowed()

		await this.questionCommentsRepository.delete(questionComment)
	}
}