import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true, trim: true },
	contentGridfsId: { type: String, required: true },
	category: { type: String, enum:['TEXT','HTML','VIDEO','AUDIO','IMAGE'], required: true, trim: true },
	relationType: { type: String, required: true, trim: true },
	status: { type: String, enum: ['DRAFT', 'PENDING', 'PUBLISHED'], default: 'DRAFT' },
	validatedAndPublishedAt: { type: Date },
	validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true }); // createdAt, updatedAt

export default mongoose.model('Resource', resourceSchema);
