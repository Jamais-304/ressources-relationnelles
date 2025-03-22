interface ErrorMapping {
    message: string
    statusCode: number
}
/**
 * Array of error mappings used to determine the HTTP status code based on the error message.
 */
export const ErrorMappings: ErrorMapping[] = [
    { message: "Invalid role", statusCode: 400 },
    { message: "Missing information", statusCode: 400 },
    { message: "No conditions met", statusCode: 400 },
    { message: "Unauthorized access", statusCode: 401 },
    { message: "Not authorized", statusCode: 401 },
    { message: "Incorrect username/password pair!", statusCode: 401 },
    { message: "Insufficient access", statusCode: 403 },
    { message: "Invalid token", statusCode: 403 },
    { message: "Refresh Token expired", statusCode: 403 },
    { message: "Server error", statusCode: 500 }
]

/**
 * Error handler function to map errors to appropriate HTTP status codes.
 *
 * This function logs the error, checks if it is an instance of the Error class,
 * and maps the error message to a corresponding HTTP status code using predefined mappings.
 * If no mapping is found, it defaults to a 500 status code.
 *
 * @param {unknown} error - The error object to handle.
 * @returns {number} - The HTTP status code corresponding to the error.
 */
export const errorHandler = (error: unknown): number => {
    if (error instanceof Error) {
        const mapping = ErrorMappings.find(mapping => mapping.message === error.message)
        return mapping ? mapping.statusCode : 500
    }
    return 500
}