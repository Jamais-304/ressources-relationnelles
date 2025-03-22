import bcrypt from "bcrypt"
import User from "../models/User.ts"

jest.mock("bcrypt")
jest.mock("../models/User.ts")

;(bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword")
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