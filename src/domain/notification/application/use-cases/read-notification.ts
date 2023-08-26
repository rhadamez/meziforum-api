import { NotAllowed } from '@/core/errors/NotAllowed'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { NotificationNotFoundException } from '@/core/errors/NotificationNotFoundException'
import { Notification } from '../../enterprise/entities/notification'

interface ReadNotificationRequest {
  recipientId: string
  notificationId: string
}

interface ReadNotificationResponse {
  notification: Notification
}

export class ReadNotificationUseCase {
	constructor(
    private notificationRepository: NotificationsRepository
	) {}

	async execute({ notificationId, recipientId }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
		const notification = await this.notificationRepository.findById(notificationId)
		if(!notification) throw new NotificationNotFoundException()

		if(recipientId !== notification.recipientId.toString()) throw new NotAllowed()

		notification.read()

		await this.notificationRepository.save(notification)

		return { notification }
	}
}