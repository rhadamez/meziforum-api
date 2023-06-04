import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '@/domain/entities/answer'

const fakeAnswerRepository: AnswersRepository = {
  create: async (answer: Answer) => undefined
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository)

  const answer = await answerQuestion.execute({
    content: 'Nova resposta',
    questionId: '1',
    instructorId: '1'
  })

  expect(answer.content).toEqual('Nova resposta')
})