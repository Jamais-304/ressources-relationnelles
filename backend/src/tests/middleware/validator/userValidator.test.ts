import request from "supertest"
import app from "../../../app.ts"
import { userMsgEmailInvalid, userMsgLength, userMsgMustBeString } from "../../../handlerResponse/errorHandler/configs.ts"

const password = "mot de passe"
const pseudonyme = "pseudonyme"

describe("User Validator", () => {
    it("should return error when pseudonyme is too short", async () => {
        const newUser = {
            email: "test@test.com",
            password: "testtest",
            pseudonyme: "test"
        }

        const response = await request(app).post("/api/v1/users/create-user").send(newUser)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toHaveProperty("errors")
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: "test",
            msg: userMsgLength(pseudonyme, 5, 40),
            path: "pseudonyme",
            location: "body"
        })
    })

    it("should return error when pseudonyme is a number", async () => {
        const newUser = {
            email: "test@test.com",
            password: "testtest",
            pseudonyme: 123
        }
        const response = await request(app).post("/api/v1/users/create-user").send(newUser)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toHaveProperty("errors")
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: 123,
            msg: userMsgMustBeString(pseudonyme),
            path: "pseudonyme",
            location: "body"
        })
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: 123,
            msg: userMsgLength(pseudonyme, 5, 40),
            path: "pseudonyme",
            location: "body"
        })
    })

    it("should return error when password is too short", async () => {
        const newUser = {
            email: "test@test.com",
            password: "test",
            pseudonyme: "testtest"
        }

        const response = await request(app).post("/api/v1/users/create-user").send(newUser)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toHaveProperty("errors")
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: "test",
            msg: userMsgLength(password, 8, 50),
            path: "password",
            location: "body"
        })
    })

    it("should return error when password is a number", async () => {
        const newUser = {
            email: "test@test.com",
            password: 123,
            pseudonyme: "testtest"
        }
        const response = await request(app).post("/api/v1/users/create-user").send(newUser)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toHaveProperty("errors")
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: 123,
            msg: userMsgMustBeString(password),
            path: "password",
            location: "body"
        })
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: 123,
            msg: userMsgLength(password, 8, 50),
            path: "password",
            location: "body"
        })
    })

    it("should return error when email is invalid", async () => {
        const newUser = {
            email: "testtest.com",
            password: "testtesttest",
            pseudonyme: "testtest"
        }
        const response = await request(app).post("/api/v1/users/create-user").send(newUser)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toHaveProperty("errors")
        expect(response.body.error.errors).toContainEqual({
            type: "field",
            value: "testtest.com",
            msg: userMsgEmailInvalid,
            path: "email",
            location: "body"
        })
    })
    it("should return several errors when all input values are invalid", async () => {
        const newUser = {
            email: "testtest.com",
            password: 123,
            pseudonyme: 122
        }
        const response = await request(app).post("/api/v1/users/create-user").send(newUser)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toHaveProperty("errors")
        expect(response.body.error.errors).toEqual(
            expect.arrayContaining([
                {
                    type: "field",
                    value: "testtest.com",
                    msg: userMsgEmailInvalid,
                    path: "email",
                    location: "body"
                },
                {
                    type: "field",
                    value: 123,
                    msg: userMsgLength(password, 8, 50),
                    path: "password",
                    location: "body"
                },
                {
                    type: "field",
                    value: 123,
                    msg: userMsgMustBeString(password),
                    path: "password",
                    location: "body"
                },
                {
                    type: "field",
                    value: 122,
                    msg: userMsgMustBeString(pseudonyme),
                    path: "pseudonyme",
                    location: "body"
                },
                {
                    type: "field",
                    value: 122,
                    msg: userMsgLength(pseudonyme, 5, 40),
                    path: "pseudonyme",
                    location: "body"
                }
            ])
        )
    })
})
