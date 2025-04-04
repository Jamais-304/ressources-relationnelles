// Import the body object from express-validator
import { body } from "express-validator"
import mongoose from "mongoose"
import {
    commentsMsgIdMustBeString,
    commentsMsgIdCannotBeEmpty,
    commentsIdMaxLength,
    commentsMsgIdInvalid,
    content,
    author,
    resource
} from "../../handlerResponse/errorHandler/configs.ts"
import {uuidMaxLength} from "../../configs.ts"

// Validation rules for comments
export const commentsValidationRules = [
    // Content: string, required, unique, trim
    body("content")
        .isString()
        .withMessage(commentsMsgIdMustBeString(content))
        .notEmpty()
        .withMessage(commentsMsgIdCannotBeEmpty(content))
        .trim()
        .escape(),
    // Author ID: string, required, max length 35, trim, UUID format
    body("authorId")
        .isString()
        .withMessage(commentsMsgIdMustBeString(author))
        .notEmpty()
        .withMessage(commentsMsgIdCannotBeEmpty(author))
        .isLength({ max: uuidMaxLength })
        .withMessage(commentsIdMaxLength(author, uuidMaxLength))
        .trim()
        .escape()
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(commentsMsgIdInvalid(author))
            }
            return true
        }),
    // Resource ID: string, required, max length 35, trim, UUID format
    body("resourceId")
        .isString()
        .withMessage(commentsMsgIdMustBeString(resource))
        .notEmpty()
        .withMessage(commentsMsgIdCannotBeEmpty(resource))
        .isLength({ max: uuidMaxLength })
        .withMessage(commentsIdMaxLength(resource, uuidMaxLength))
        .trim()
        .escape()
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(commentsMsgIdInvalid(resource))
            }
            return true
        })
]
