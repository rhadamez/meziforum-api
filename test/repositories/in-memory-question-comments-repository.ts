import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = []

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment)
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questioncomment = this.items.find(item => item.id.toString() === id)
		if(!questioncomment) return null

		return questioncomment
	}

	async delete(questioncomment: QuestionComment): Promise<void> {
		const questioncommentIndex = this.items.findIndex(item => item.id === questioncomment.id)
		this.items.splice(questioncommentIndex, 1)
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
		const questions = this.items
			.filter(item => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)

		return questions
	}

}