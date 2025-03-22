import { errorHandler, ErrorMappings } from "../../utils/errorHandler.ts"

describe("errorHandler", () => {
    it("should return 500 for unknown errors", () => {
        const result = errorHandler("unknown error")
        expect(result).toBe(500)
    })

    it("should return the correct status code for known errors", () => {
        const knownError = new Error("Known Error")
        const mapping = { message: "Known Error", statusCode: 404 }
        ErrorMappings.push(mapping)

        const result = errorHandler(knownError)
        expect(result).toBe(404)

        // Clean up
        ErrorMappings.pop()
    })

    it("should return 500 for errors not in ErrorMappings", () => {
        const unknownError = new Error("Unknown Error")
        const result = errorHandler(unknownError)
        expect(result).toBe(500)
    })
})
