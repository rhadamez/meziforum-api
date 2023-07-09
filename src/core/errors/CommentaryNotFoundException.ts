import { AppError } from '../entities/app-error'

export class CommentaryNotFoundException extends AppError {
	constructor() {
		super('Commentary not found on this question')
	}
}