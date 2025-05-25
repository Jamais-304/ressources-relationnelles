import mongoose, { Document, Schema } from "mongoose";

export interface IRelationTypeInterface {
	name: string;
	displayName: string;
	description?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface IRelationTypeSchema extends IRelationTypeInterface, Document {}

const relationTypeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Relation type name is required"],
			unique: true,
			trim: true,
			maxlength: [30, "Relation type name must be at most 30 characters long"],
		},
		displayName: {
			type: String,
			required: [true, "Display name is required"],
			trim: true,
			maxlength: [50, "Display name must be at most 50 characters long"],
		},
		description: {
			type: String,
			trim: true,
			default: null
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
);

const RelationType = mongoose.model<IRelationTypeSchema>("RelationType", relationTypeSchema);

export default RelationType; 