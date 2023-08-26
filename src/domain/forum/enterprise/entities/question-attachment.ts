import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmenProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmenProps> {

	get questionId() {
		return this.props.questionId
	}

	get attachmentId() {
		return this.props.attachmentId
	}

	static create(props: QuestionAttachmenProps, id?: UniqueEntityID) {
		return new QuestionAttachment(props, id)
	}

}