import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { NotAllowed } from '@/core/errors/NotAllowed'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswerRepository
let answerAttachmentsRepository: AnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
	beforeEach(() => {
		answersRepository = new InMemoryAnswerRepository()
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
	})

	test('should be able to edit an answer', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('answer-1'))

		await answersRepository.create(newAnswer)

		await sut.execute({
			authorId: 'author-1',
			answerId: newAnswer.id.toString(),
			content: 'updated-content',
			attachmentsIds: ['1', '2']
		})

		expect(answersRepository.items[0]).toMatchObject({
			content: 'updated-content'
		})
		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('2') })
		])
	})

	test('should not be able to edit an answer from a non author user', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('answer-1'))

		await answersRepository.create(newAnswer)

		expect(() => {
			return sut.execute({
				authorId: 'author-2',
				answerId: 'answer-1',
				content: 'updated-content',
				attachmentsIds: []
			})
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
