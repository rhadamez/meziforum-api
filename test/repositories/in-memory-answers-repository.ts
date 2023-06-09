import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswerRepository implements AnswersRepository {
	public items: Answer[] = []

	async create(answer: Answer): Promise<void> {
		this.items.push(answer)
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find(item => item.id.toString() === id)
		if(!answer) return null

		return answer
	}

	async delete(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex(item => item.id === answer.id)
		this.items.splice(answerIndex, 1)
	}

	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex(item => item.id === answer.id)

		this.items[answerIndex] = answer
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
		const answers = this.items
			.filter(item => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)

		return answers
	}

}