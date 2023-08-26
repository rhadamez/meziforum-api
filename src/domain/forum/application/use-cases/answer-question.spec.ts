import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let answersRepository: InMemoryAnswerRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
	beforeEach(() => {
		answersRepository = new InMemoryAnswerRepository()
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		sut = new AnswerQuestionUseCase(answersRepository, answerAttachmentsRepository)
	})

	test('should be able to create an answer', async () => {
		const { answer } = await sut.execute({
			content: 'Nova resposta',
			questionId: '1',
			instructorId: '1',
			attachmentsIds: ['1', '2']
		})

		expect(answer.id).toBeTruthy()
		expect(answersRepository.items[0].id).toEqual(answer.id)
		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('2') })
		])
	})
})