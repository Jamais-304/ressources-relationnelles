import express from "express"
import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { MONGO_URI } from "../config.ts"
import yaml from "yamljs"
import swaggerUi from "swagger-ui-express"
import userRouter from "../router/userRoutes.ts"

const app = express()
const swaggerDocs = yaml.load("swagger.yaml")

// Conection to MongoDB Atlas DataBase
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Connexion à MongoDB réussie ✅"))
    .catch(() => console.log("Connexion à MongoDB échouée ❌"))

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*") // Allows access to the API from any origin
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, userid") // Allows the specified headers in requests to the API
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS") // Allows the specified HTTP methods in requests to the API
    next()
})

app.use(express.json())
// Routes Users
app.use("/api", userRouter)
// Docuementation API
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default app
