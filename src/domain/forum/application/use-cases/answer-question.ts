import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
	attachmentsIds: string[]
}

interface AnswerQuestionUseCaseResponse {
	answer: Answer
}

export class AnswerQuestionUseCase {

	constructor(
    private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository
	) { }

	async execute({ instructorId, questionId, content, attachmentsIds }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(instructorId),
			questionId: new UniqueEntityID(questionId),
		})

		const answerAttachments = attachmentsIds.map(item => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(item),
				answerId: answer.id
			})
		})

		answer.attachments = new AnswerAttachmentList(answerAttachments)

		await this.answersRepository.create(answer)

		return { answer }
	}
}