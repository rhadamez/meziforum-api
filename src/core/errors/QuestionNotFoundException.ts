import { AppError } from '../entities/app-error'

export class QuestionNotFoundException extends AppError {
	constructor() {
		super('Answer not found')
	}
}