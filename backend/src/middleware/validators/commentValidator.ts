// Import the body object from express-validator
import { body } from "express-validator"
import mongoose from "mongoose"

// Validation rules for comments
export const commentsValidationRules = [
    // Content: string, required, unique, trim
    body("content")
        .isString()
        .withMessage("Content must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .trim()
        .escape(),
    // Author ID: string, required, min length 8, max length 90, trim, UUID format
    body("authorId")
        .isString()
        .withMessage("Author ID must be a string")
        .isLength({ max: 35 })
        .withMessage("Author ID must be not exceed 35 characters")
        .trim()
        .escape()
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Author ID must be a valid MongoDB ObjectId")
            }
            return true
        }),
    // Resource ID: string, required, min length 5, max length 40, trim, UUID format
    body("resourceId")
        .isString()
        .withMessage("Resource ID must be a string")
        .isLength({ max: 35 })
        .withMessage("Resource ID must be not exceed 35 characters")
        .trim()
        .escape()
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Resource ID must be a valid MongoDB ObjectId")
            }
            return true
        })
]
