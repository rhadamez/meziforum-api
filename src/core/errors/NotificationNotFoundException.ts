import { AppError } from '../entities/app-error'

export class NotificationNotFoundException extends AppError {
	constructor() {
		super('Notification not found')
	}
}