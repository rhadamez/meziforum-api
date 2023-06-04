import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface QuestionProps {
  title: string
  content: string
  slug: Slug
  bestAnswerId?: UniqueEntityID
  authorId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {

	static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityID) {
		const question = new Question({
			...props,
			slug: props.slug ?? Slug.createFromText(props.title),
			createdAt: new Date()
		}, id)
 
		return question
	}

	get title() {
		return this.props.title
	}

	set title(title: string) {
		this.props.title = title
		this.props.slug = Slug.createFromText(title)
		this.touch()
	}

	get content() {
		return this.props.content
	}

	set content(content: string) {
		this.props.content = content
		this.touch()
	}

	get slug() {
		return this.props.slug
	}

	get bestAnswerId() {
		return this.props.bestAnswerId
	}

	set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
		this.props.bestAnswerId = bestAnswerId
		this.touch()
	}

	get authorId() {
		return this.props.authorId
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat('...')
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	get isNew(): boolean {
		const timeDiff = Math.abs(new Date().getTime() - this.createdAt.getTime())
		const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

		return daysDiff <= 3
	}

}