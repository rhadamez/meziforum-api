import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
	beforeEach(() => {
		answersRepository = new InMemoryAnswerRepository()
		sut = new EditAnswerUseCase(answersRepository)
	})

	test('should be able to edit an answer', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID('author-1')
		}, new UniqueEntityID('answer-1'))

		await answersRepository.create(newAnswer)

		await sut.execute({
			authorId: 'author-1',
			answerId: newAnswer.id.toString(),
			content: 'updated-content'
		})

		expect(answersRepository.items[0]).toMatchObject({
			content: 'updated-content'
		})
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
				content: 'updated-content'
			})
		}).rejects.toBeInstanceOf(Error)
	})
})
