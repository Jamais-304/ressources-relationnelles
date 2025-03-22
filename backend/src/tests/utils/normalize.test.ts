import { normalize } from "../../utils/normailze.ts"

describe("normalize", () => {
    it("should return the correct port number when the input is a valid numeric string", () => expect(normalize("4550")).toBe(4550))
    it("should return the original string if the input is not a valid number", () => expect(normalize("abc")).toBe("abc"))
    it("should throw an error if the input is <= 0", () => {
        expect(() => normalize("-1")).toThrowError("Value cannot be ≤ to 0: -1")
    })
})
