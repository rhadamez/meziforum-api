import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'

interface FetchRecentTopicUseCaseRequest {
	page: number
}

interface FetchRecentTopicsUseCaseResponse {
	questions: Question[]
}

export class FetchRecentTopicsUseCase {

	constructor(
    private questionsRepository: QuestionsRepository
	) { }

	async execute({ page }: FetchRecentTopicUseCaseRequest): Promise<FetchRecentTopicsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({ page })

		return { questions }
	}
}