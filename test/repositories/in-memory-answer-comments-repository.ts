import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = []

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment)
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answercomment = this.items.find(item => item.id.toString() === id)
		if(!answercomment) return null

		return answercomment
	}

	async delete(answercomment: AnswerComment): Promise<void> {
		const answercommentIndex = this.items.findIndex(item => item.id === answercomment.id)
		this.items.splice(answercommentIndex, 1)
	}

	async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
		const answerComments = this.items
			.filter(item => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20)

		return answerComments
	}

}