import { errorHandler } from "../../handlerResponse/errorHandler/errorHandler.ts"
import { serverError, msgServerError } from "../../handlerResponse/errorHandler/configs.ts"
import { Response } from "express"

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {}
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
    return res
}

describe("errorHandler", () => {
    it("should return 500 for unknown error types", () => {
        const res = mockResponse()
        errorHandler(res as Response, serverError)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            error: {
                location: undefined,
                msg: msgServerError
            }
        })
    })
})
