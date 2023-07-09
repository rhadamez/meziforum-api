import { NotAllowed } from '@/core/errors/NotAllowed'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'
import { QuestionNotFoundException } from '@/core/errors/QuestionNotFoundException'

interface EditQuestionUseCaseRequest {
	questionId: string
	authorId: string
	title: string
	content: string
}

interface EditQuestionUseCaseResponse {
	question: Question
}

export class EditQuestionUseCase {

	constructor(
    private questionsRepository: QuestionsRepository
	) { }

	async execute({ questionId, authorId, title, content }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId)

		if(!question) throw new QuestionNotFoundException()

		if(authorId !== question.authorId.toString()) throw new NotAllowed()

		question.title = title
		question.content = content

		await this.questionsRepository.save(question)

		return { question }
	}
}