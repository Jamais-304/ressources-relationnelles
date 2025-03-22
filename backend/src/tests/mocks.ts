import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.ts"

jest.mock("bcrypt")
jest.mock("jsonwebtoken")
jest.mock("../models/User.ts")

;(bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword")
;(jwt.sign as jest.Mock).mockResolvedValue("mockedToken")
;(User.findOne as jest.Mock).mockResolvedValue({
    _id: "123",
    email: "test@test.com",
    password: "hashedPassword",
    pseudonyme: "usertest",
    role: "super-administrateur"
})
;;(User.prototype.save as jest.Mock).mockResolvedValue({
    _id: "123",
    email: "test@test.com",
    password: "hashedPassword",
    pseudonyme: "usertest",
    role: "super-administrateur"
})