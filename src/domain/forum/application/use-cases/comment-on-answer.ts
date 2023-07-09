import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerNotFoundException } from '@/core/errors/AnswerNotFoundException'

interface CommentOnAnswerUseCaseRequest {
	authorId: string
	answerId: string
	content: string
}

interface CommentOnAnswerCaseResponse {
	answerComment: AnswerComment
}

export class CommentOnAnswer {
	constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
	) { }

	async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerCaseResponse> {
		const answers = await this.answersRepository.findById(answerId)
		if(!answers) throw new AnswerNotFoundException()

		const answerComment = AnswerComment.create({
			content,
			authorId: new UniqueEntityID(authorId),
			answerId: new UniqueEntityID(answerId)
		})

		await this.answerCommentsRepository.create(answerComment)

		return { answerComment }
	}
}