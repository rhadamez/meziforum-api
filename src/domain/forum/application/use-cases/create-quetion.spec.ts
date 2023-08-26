import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
		sut = new CreateQuestionUseCase(questionsRepository)
	})

	test('should be able to create a question', async () => {
		const { question } = await sut.execute({
			title: 'Nova pergunta',
			content: 'Conteúdo da pergunta',
			authorId: '1',
			attachmentsIds: ['1', '2']
		})

		expect(question.id).toBeTruthy()
		expect(questionsRepository.items[0].id).toEqual(question.id)
		expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(questionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('2') })
		])
	})
})
