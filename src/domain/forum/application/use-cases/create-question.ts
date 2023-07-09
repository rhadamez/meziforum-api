import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface CreateQuestionUseCaseRequest {
	authorId: string
	title: string
	content: string
	attachmentsIds: string[]
}

interface CreateQuestionUseCaseResponse {
	question: Question
}

export class CreateQuestionUseCase {

	constructor(
    private questionsRepository: QuestionsRepository
	) { }

	async execute({ authorId, title, content, attachmentsIds }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({
			authorId: new UniqueEntityID(authorId), title, content
		})

		const questionAttachments = attachmentsIds.map(item => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(item),
				questionId: question.id
			})
		})

		question.attachments = questionAttachments

		await this.questionsRepository.create(question)

		return { question }
	}
}