import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

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
		if(!questionComment) throw new Error('Comment not found on this question.')

		if(authorId !== questionComment.authorId.toString()) throw new Error('Not allowed.')

		await this.questionCommentsRepository.delete(questionComment)
	}
}