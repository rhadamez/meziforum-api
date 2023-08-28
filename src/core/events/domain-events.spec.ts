import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreate implements DomainEvent {
	public ocurredAt: Date
	private aggregate: CustomAggregate

	constructor(aggregate: CustomAggregate) {
		this.ocurredAt = new Date()
		this.aggregate = aggregate
	}

	getAggregateId(): UniqueEntityID {
		return this.aggregate.id
	}

}

class CustomAggregate extends AggregateRoot<null> {
	static create() {
		const aggregate = new CustomAggregate(null)
		aggregate.addDomainEvent(new CustomAggregateCreate(aggregate))
		return aggregate 
	}
}

describe('Domain Events', () => {
	it('should be able to dispatch and listen to events', () => {
		const callbackSpy = vi.fn(() => {
			console.log('disparou agora')
		})

		DomainEvents.register(callbackSpy, CustomAggregateCreate.name)

		const aggregate = CustomAggregate.create()

		expect(aggregate.domainEvents).toHaveLength(1)

		DomainEvents.dispatchEventsForAggregate(aggregate.id)

		expect(callbackSpy).toHaveBeenCalled()
		expect(aggregate.domainEvents).toHaveLength(0)
	})
})