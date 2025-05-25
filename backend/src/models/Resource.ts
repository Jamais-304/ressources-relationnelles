import mongoose, { Document, Schema } from 'mongoose';
import { type ResourceInterface } from '../interfaces/resourceInterface.ts';

interface IResourceSchema extends ResourceInterface, Document {}

const resourceSchema = new mongoose.Schema({
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, "Author's ID is required"]
	},
	title: {
		type: String, 
		required: [true, "Title is required"], 
		trim: true 
	},
	contentGridfsId: { 
		type: String, 
		required: [true, "Content's GridFS ID is required"], 
	},
	resourceMIMEType: {
		type: String,
		enum: [
			'image/jpeg', 'image/png', 'image/gif',
			'audio/mpeg', 'audio/wav',
			'video/mp4', 'video/webm',
			'text/plain', 'text/html'
		],
		required: [true, "MIME type is required"],
		trim: true
	},
	category: { 
		type: String,
		required: [true, "Category is required"], 
		trim: true
	},
	relationType: { 
		type: String, 
		required: [true, "Relation type is required"], 
		trim: true 
	},
	status: { 
		type: String, 
		enum: ['DRAFT', 'PENDING', 'PUBLISHED', 'STATICRESOURCE'], 
		default: 'DRAFT' 
	},
	validatedAndPublishedAt: { 
		type: Date 
	},
	validatedBy: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},

}, { timestamps: true }); // createdAt, updatedAt

// Middleware/hooks
resourceSchema.pre('save', function (next) {
	// If the "status" field changes to "PUBLISHED" but the "validatedAndPublishedAt" field was empty:
	if (this.isModified('status') && this.status === 'PUBLISHED' && !this.validatedAndPublishedAt) {
		// automatically set the current date for "validatedAndPublishedAt" field
		this.validatedAndPublishedAt = new Date();
	}

	next();
});

// Indexes
resourceSchema.index({ authorId: 1 });
resourceSchema.index({ title: 'text' });

const Resource = mongoose.model<IResourceSchema>('Resource', resourceSchema);
export default Resource
