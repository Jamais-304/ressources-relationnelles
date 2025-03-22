import request from "supertest"
import app from "../../app.ts"
// import USer from "../../models/User.ts"
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
import "../mocks.ts"

describe("User Controller", () => {
    it("should create a new user", async () => {
        const newUser = {
            email: "test@test.com",
            password: "testtest",
            pseudonyme: "usertest"
        }

        const response = await request(app).post("/api/v1/users/create-user").send(newUser)
        expect(response.status).toBe(201)
        //Check reponse strucutre
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("tokens")
        expect(response.body.data.tokens).toHaveProperty("accessToken")
        expect(response.body.data.tokens).toHaveProperty("refreshToken")
        // Check token are a string not empty
        expect(typeof response.body.data.tokens.accessToken).toBe("string")
        expect(response.body.data.tokens.accessToken.length).toBeGreaterThan(0)
        expect(typeof response.body.data.tokens.refreshToken).toBe("string")
        expect(response.body.data.tokens.refreshToken.length).toBeGreaterThan(0)
        // Check information of the newUser
        expect(response.body.data.user).toHaveProperty("pseudonyme", "usertest")
        expect(response.body.data.user).toHaveProperty("role", "utilisateur")
    })
})
