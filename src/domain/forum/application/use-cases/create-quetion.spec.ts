import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
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
