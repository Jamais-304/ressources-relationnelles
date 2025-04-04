export default interface ResourceInterface {

	authorId: string;
	title: string;
	contentGridfsId: string;
	category: 'TEXT' | 'HTML' | 'VIDEO' | 'AUDIO' | 'IMAGE';
	relationType: string;
	status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
	validatedAndPublishedAt?: Date;
	validatedBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
