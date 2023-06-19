import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string
	page: number
}

interface FetchQuestionCommentssUseCaseResponse {
	questionComments: QuestionComment[]
}

export class FetchQuestionCommentssUseCase {

	constructor(
    private questionCommentsRepository: QuestionCommentsRepository
	) { }

	async execute({ page, questionId }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentssUseCaseResponse> {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page })

		return { questionComments }
	}
}