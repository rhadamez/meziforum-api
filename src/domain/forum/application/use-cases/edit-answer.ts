import { AnswerNotFoundException } from '@/core/errors/AnswerNotFoundException'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowed } from '@/core/errors/NotAllowed'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface EditAnswerUseCaseRequest {
	answerId: string
	authorId: string
	content: string
	attachmentsIds: string[]
}

interface EditAnswerUseCaseResponse {
	answer: Answer
}

export class EditAnswerUseCase {

	constructor(
    private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository
	) { }

	async execute({ answerId, authorId, content, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if(!answer) throw new AnswerNotFoundException()

		if(authorId !== answer.authorId.toString()) throw new NotAllowed()

		const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
		const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

		const answerAttachments = attachmentsIds.map(item => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(item),
				answerId: answer.id
			})
		})

		answerAttachmentList.update(answerAttachments)

		answer.content = content
		answer.attachments = answerAttachmentList

		await this.answersRepository.save(answer)

		return { answer }
	}
}