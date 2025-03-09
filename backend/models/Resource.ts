import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true, trim: true },
	contentGridfsId: { type: String, required: true },
	category: { type: String, enum: ['TEXT', 'HTML', 'VIDEO', 'AUDIO', 'IMAGE'], required: true, trim: true },
	relationType: { type: String, required: true, trim: true },
	status: { type: String, enum: ['DRAFT', 'PENDING', 'PUBLISHED'], default: 'DRAFT' },
	validatedAndPublishedAt: { type: Date },
	validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

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

export default mongoose.model('Resource', resourceSchema);
