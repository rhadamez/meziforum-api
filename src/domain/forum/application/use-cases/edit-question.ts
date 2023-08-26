import { NotAllowed } from '@/core/errors/NotAllowed'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'
import { QuestionNotFoundException } from '@/core/errors/QuestionNotFoundException'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
	questionId: string
	authorId: string
	title: string
	content: string
	attachmentsIds: string[]
}

interface EditQuestionUseCaseResponse {
	question: Question
}

export class EditQuestionUseCase {

	constructor(
    private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository
	) { }

	async execute({ questionId, authorId, title, content, attachmentsIds }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId)

		if(!question) throw new QuestionNotFoundException()

		if(authorId !== question.authorId.toString()) throw new NotAllowed()

		const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
		const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

		const questionAttachments = attachmentsIds.map(item => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(item),
				questionId: question.id
			})
		})

		questionAttachmentList.update(questionAttachments)

		question.title = title
		question.content = content
		question.attachments = questionAttachmentList

		await this.questionsRepository.save(question)

		return { question }
	}
}