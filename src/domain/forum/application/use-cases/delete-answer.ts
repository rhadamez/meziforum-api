import { NotAllowed } from '@/core/errors/NotAllowed'
import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseRequest {
	authorId: string
	answerId: string
}

export class DeleteAnswerUseCase {

	constructor(
    private answersRepository: AnswersRepository
	) { }

	async execute({ authorId, answerId }: DeleteAnswerUseCaseRequest): Promise<void> {
		const Answer = await this.answersRepository.findById(answerId)

		if(!Answer) throw new NotAllowed()

		if(authorId !== Answer.authorId.toString()) throw new NotAllowed()

		await this.answersRepository.delete(Answer)
	}
}