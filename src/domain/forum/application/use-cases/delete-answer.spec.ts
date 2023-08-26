import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowed } from '@/core/errors/NotAllowed'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
	beforeEach(() => {
		const answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		answersRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
		sut = new DeleteAnswerUseCase(answersRepository)
	})

	test('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('answer-1'))

		await answersRepository.create(newAnswer)

		await sut.execute({ authorId: 'author-1', answerId: 'answer-1' })

		expect(answersRepository.items).toHaveLength(0)
	})

	test('should not be able to delete a answer from a non author user', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('answer-1'))

		await answersRepository.create(newAnswer)

		expect(() => {
			return sut.execute({ authorId: 'author-2', answerId: 'answer-1' })
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
