import { QuestionsRepository } from '../repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
	questionId: string
}

export class DeleteQuestionUseCase {

	constructor(
    private questionsRepository: QuestionsRepository
	) { }

	async execute({ questionId }: DeleteQuestionUseCaseRequest): Promise<void> {
		const question = await this.questionsRepository.findById(questionId)

		if(!question) throw new Error('Question not found.')

		await this.questionsRepository.delete(question)
	}
}