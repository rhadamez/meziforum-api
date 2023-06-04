import { QuestionsRepository } from '../repositories/question-repository'
import { Question } from '../../enterprise/entities/question'
import { CreateQuestionUseCase } from './create-question'

const fakeQuestionsRepository: QuestionsRepository = {
	create: async (question: Question) => undefined
}

test('create an question', async () => {
	const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository)

	const { question } = await createQuestion.execute({
		title: 'Nova pergunta',
		content: 'Conteúdo da pergunta',
		authorId: '1'
	})

	expect(question.id).toBeTruthy()
})