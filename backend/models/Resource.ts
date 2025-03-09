import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	contentGridfsId: { type: String, required: true },
	category: { type: String, enum:['TEXT','HTML','VIDEO','AUDIO','IMAGE'], required: true, trim: true },
	relationType: { type: String, required: true, trim: true },
	status: { type: String, enum: ['DRAFT', 'PENDING', 'PUBLISHED'], default: 'DRAFT' },

}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
