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
		const answer = await this.answersRepository.findById(answerId)

		if(!answer) throw new NotAllowed()

		if(authorId !== answer.authorId.toString()) throw new NotAllowed()

		await this.answersRepository.delete(answer)
	}
}