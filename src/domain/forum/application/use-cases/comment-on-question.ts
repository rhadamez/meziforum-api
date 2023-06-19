import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/question-repository'

interface CommentOnQuestionUseCaseRequest {
	authorId: string
	questionId: string
	content: string
}

interface CommentOnQuestionCaseResponse {
	questionComment: QuestionComment
}

export class CommentOnQuestion {
	constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
	) { }

	async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionCaseResponse> {
		const questions = await this.questionsRepository.findById(questionId)
		if(!questions) throw new Error('Question not found')

		const questionComment = QuestionComment.create({
			content,
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId)
		})

		await this.questionCommentsRepository.create(questionComment)

		return { questionComment }
	}
}