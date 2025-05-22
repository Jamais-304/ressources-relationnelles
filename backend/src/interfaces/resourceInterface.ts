export interface ResourceInterface {
	authorId: string;
	title: string;
	contentGridfsId: string;
	resourceMIMEType: 'image/jpeg' | 'image/png' | 'image/gif' |
		'audio/mpeg' | 'audio/wav' |
		'video/mp4' | 'video/webm' |
		'text/plain' | 'text/html';
	category: string;
	relationType: string;
	status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
	validatedAndPublishedAt?: Date;
	validatedBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
