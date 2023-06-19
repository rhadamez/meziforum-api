import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestion } from './comment-on-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestion

describe('Comment On Question', () => {
	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository()
		questionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new CommentOnQuestion(questionsRepository, questionCommentsRepository)
	})

	test('should be able to comment on question', async () => {
		const question = makeQuestion({}, new UniqueEntityID('question-id'))
		await questionsRepository.create(question)

		await sut.execute({
			authorId: 'author-1',
			questionId: question.id.toString(),
			content: 'commentary-question'
		})

		expect(questionCommentsRepository.items[0].content).toEqual('commentary-question')
	})
})
