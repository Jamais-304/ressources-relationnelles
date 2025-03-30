interface ErrorMapping {
    msg: string
    statusCode: number
}
/**
 * Array of error mappings used to determine the HTTP status code based on the error msg.
 */
export const ErrorMappings: ErrorMapping[] = [
    { msg: "Invalid role", statusCode: 400 },
    { msg: "Missing information", statusCode: 400 },
    { msg: "No conditions met", statusCode: 400 },
    { msg: "Unauthorized access", statusCode: 401 },
    { msg: "Not authorized", statusCode: 401 },
    { msg: "Incorrect username/password pair!", statusCode: 401 },
    { msg: "Insufficient access", statusCode: 403 },
    { msg: "Invalid token", statusCode: 403 },
    { msg: "Refresh Token expired", statusCode: 403 },
    { msg: "Server error", statusCode: 500 }
]

/**
 * Error handler function to map errors to appropriate HTTP status codes.
 *
 * This function logs the error, checks if it is an instance of the Error class,
 * and maps the error msg to a corresponding HTTP status code using predefined mappings.
 * If no mapping is found, it defaults to a 500 status code.
 *
 * @param {unknown} error - The error object to handle.
 * @returns {number} - The HTTP status code corresponding to the error.
 */
export const errorHandler = (error: unknown): number => {
    if (error instanceof Error) {
        const mapping = ErrorMappings.find(mapping => mapping.msg === error.message)
        return mapping ? mapping.statusCode : 500
    }
    return 500
}