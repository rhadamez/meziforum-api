import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = []

	constructor(
		private questionAttachmentsRepository: QuestionAttachmentsRepository
	) {}

	async create(question: Question): Promise<void> {
		this.items.push(question)
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20)

		return questions
	}

	async save(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(item => item.id === question.id)

		this.items[questionIndex] = question
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find(item => item.slug.value === slug)
		if(!question) return null

		return question
	}

	async findById(id: string): Promise<Question | null> {
		const question = this.items.find(item => item.id.toString() === id)
		if(!question) return null

		return question
	}

	async delete(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(item => item.id === question.id)
		this.items.splice(questionIndex, 1)

		this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString())
	}

}