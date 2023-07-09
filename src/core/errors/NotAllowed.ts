import { AppError } from '../entities/app-error'

export class NotAllowed extends AppError {
	constructor() {
		super('Not allowed')
	}
}