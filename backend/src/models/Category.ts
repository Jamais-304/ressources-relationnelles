import mongoose, { Document } from "mongoose";
import { type CategoryInterface } from "../interfaces/categoryInterface.ts";


interface ICategorySchema extends CategoryInterface, Document {}

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			trim: true,
			maxlength: [50, "Category name must be at most 50 characters long"],
		},
		description: {
			type: String,
			trim: true,
			default: null
		}
	},
	{
		timestamps: true
	}
);

const Category = mongoose.model<ICategorySchema>("Category", categorySchema);

export default Category;