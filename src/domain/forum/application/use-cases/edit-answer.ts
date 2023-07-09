import { AnswerNotFoundException } from '@/core/errors/AnswerNotFoundException'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowed } from '@/core/errors/NotAllowed'

interface EditAnswerUseCaseRequest {
	answerId: string
	authorId: string
	content: string
}

interface EditAnswerUseCaseResponse {
	answer: Answer
}

export class EditAnswerUseCase {

	constructor(
    private answersRepository: AnswersRepository
	) { }

	async execute({ answerId, authorId, content }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if(!answer) throw new AnswerNotFoundException()

		if(authorId !== answer.authorId.toString()) throw new NotAllowed()

		answer.content = content

		await this.answersRepository.save(answer)

		return { answer }
	}
}