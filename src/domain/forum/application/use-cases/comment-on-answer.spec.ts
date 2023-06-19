import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswer } from './comment-on-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswerRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswer

describe('Comment On Answer', () => {
	beforeEach(() => {
		answersRepository = new InMemoryAnswerRepository()
		answerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new CommentOnAnswer(answersRepository, answerCommentsRepository)
	})

	test('should be able to comment on answer', async () => {
		const answer = makeAnswer({}, new UniqueEntityID('answer-id'))
		await answersRepository.create(answer)

		await sut.execute({
			authorId: 'author-1',
			answerId: answer.id.toString(),
			content: 'commentary-answer'
		})

		expect(answerCommentsRepository.items[0].content).toEqual('commentary-answer')
	})
})
