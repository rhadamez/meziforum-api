import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/NotAllowed'

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

	test('should not be able to read a notification from another recipient', async () => {
		const newAnswer = makeNotification({
			recipientId: new UniqueEntityID('recipient-1')
		}, new UniqueEntityID('notification-1'))

		await notificationsRepository.create(newAnswer)

		expect(() => {
			return sut.execute({ recipientId: 'author-2', notificationId: 'notification-1' })
		}).rejects.toBeInstanceOf(NotAllowed)
	})
})
