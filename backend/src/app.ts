import express from "express"
import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { MONGO_URI } from "./configs.ts"
import yaml from "yamljs"
import swaggerUi from "swagger-ui-express"
import userRouter from "./router/userRoutes.ts"
import refreshTokenRouter from "./router/refreshTokenRoute.ts"
import { morganMiddleware, errorLogger } from "./logs/logger.ts"

const app = express()
app.set("trust proxy", true)

// Swagger documentation
const swaggerDocs = yaml.load("swagger.yaml")

// Connection to MongoDB Atlas Database
if (process.env.NODE_ENV !== "test") {
    mongoose
        .connect(MONGO_URI)
        .then(() => console.log("Connexion à MongoDB réussie ✅"))
        .catch(() => console.log("Connexion à MongoDB échouée ❌"))
}
// CORS middleware to allow cross-origin requests
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*") // Allows access to the API from any origin
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, userid") // Allows the specified headers in requests to the API
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS") // Allows the specified HTTP methods in requests to the API
    next()
})

// JSON parsing middleware
app.use(express.json())
app.use(morganMiddleware) // For request logging
// Routes Users
app.use("/api", userRouter, refreshTokenRouter)
// Swagger API documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// Error handling middleware should be after routes to catch errors
app.use(errorLogger) // Logs any unhandled errors

export default app
