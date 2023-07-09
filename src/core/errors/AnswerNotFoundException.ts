import { AppError } from '../entities/app-error'

export class AnswerNotFoundException extends AppError {
	constructor() {
		super('Answer not found')
	}
}