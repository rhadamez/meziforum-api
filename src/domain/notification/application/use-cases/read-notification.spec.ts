import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository()
		sut = new ReadNotificationUseCase(notificationsRepository)
	})

	test('should be able to read a notification', async () => {
		const newNotification = makeNotification()

		await notificationsRepository.create(newNotification)

		const { notification } = await sut.execute({
			recipientId: newNotification.recipientId.toString(),
			notificationId: newNotification.id.toString()
		})

		expect(notification.readAt).toBeTruthy()
		expect(notification.readAt).toBeInstanceOf(Date)
	})
})
