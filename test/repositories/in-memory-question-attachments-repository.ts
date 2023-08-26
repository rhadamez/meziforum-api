import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
	public items: QuestionAttachment[] = []

	async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		const questions = this.items
			.filter(item => item.questionId.toString() === questionId)

		return questions
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(item => item.questionId.toString() !== questionId)

		this.items = questionAttachments
	}

}