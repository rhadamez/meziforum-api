import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository()
		sut = new SendNotificationUseCase(notificationsRepository)
	})

	test('should be able to send a notification', async () => {
		const { notification } = await sut.execute({
			recipientId: '1',
			title: 'New notification',
			content: 'Notification content'
		})

		expect(notification.id).toBeTruthy()
		expect(notificationsRepository.items[0].id).toEqual(notification.id)
	})
})
