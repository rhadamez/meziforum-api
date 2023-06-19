import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string
	page: number
}

interface FetchAnswerCommentssUseCaseResponse {
	answerComments: AnswerComment[]
}

export class FetchAnswerCommentssUseCase {

	constructor(
    private answerCommentsRepository: AnswerCommentsRepository
	) { }

	async execute({ page, answerId }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentssUseCaseResponse> {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page })

		return { answerComments }
	}
}