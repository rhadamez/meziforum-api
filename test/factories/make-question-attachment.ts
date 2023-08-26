import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachmenProps, QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmenProps> = {},
	id?: UniqueEntityID) {
	const questionComment = QuestionAttachment.create({
		questionId: new UniqueEntityID(),
		attachmentId: new UniqueEntityID(),
		...override
	}, id)

	return questionComment
}