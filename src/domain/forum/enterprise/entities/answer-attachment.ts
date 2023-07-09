import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerAttachmenProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmenProps> {

	get answerId() {
		return this.props.answerId
	}

	get attachmentId() {
		return this.props.attachmentId
	}

	static create(props: AnswerAttachmenProps, id?: UniqueEntityID) {
		return new AnswerAttachment(props, id)
	}

}