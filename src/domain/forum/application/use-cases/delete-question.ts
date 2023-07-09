import { QuestionNotFoundException } from '@/core/errors/QuestionNotFoundException'
import { QuestionsRepository } from '../repositories/question-repository'
import { NotAllowed } from '@/core/errors/NotAllowed'

interface DeleteQuestionUseCaseRequest {
	authorId: string
	questionId: string
}

export class DeleteQuestionUseCase {

	constructor(
    private questionsRepository: QuestionsRepository
	) { }

	async execute({ authorId, questionId }: DeleteQuestionUseCaseRequest): Promise<void> {
		const question = await this.questionsRepository.findById(questionId)

		if(!question) throw new QuestionNotFoundException()

		if(authorId !== question.authorId.toString()) throw new NotAllowed()

		await this.questionsRepository.delete(question)
	}
}