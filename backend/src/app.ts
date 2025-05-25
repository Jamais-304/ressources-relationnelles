import express from "express"
import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { MONGO_URI } from "./configs.ts"
import yaml from "yamljs"
import swaggerUi from "swagger-ui-express"
import userRouter from "./router/userRoutes.ts"
import resourceRoutes from "./router/resourceRoutes.ts"
import categoryRoutes from "./router/categoryRoutes.ts"
import relationTypeRoutes from "./router/relationTypeRoutes.ts"
import refreshTokenRouter from "./router/refreshTokenRoute.ts"
import { morganMiddleware, errorLogger } from "./logs/logger.ts"
import statsRoutes from "./router/statsRoutes.ts"

const app = express()
app.set("trust proxy", true)

// Swagger documentation
const swaggerDocs = yaml.load("swagger.yaml")

// Connection to MongoDB Atlas Database
if (process.env.NODE_ENV !== "test") {
    mongoose
        .connect(MONGO_URI, { dbName: process.env.DB_NAME })
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

if (process.env.NODE_ENV !== "test") {
    app.use(morganMiddleware) // For request logging
}
// Routes
app.use("/api", userRouter, refreshTokenRouter, resourceRoutes, categoryRoutes, relationTypeRoutes, statsRoutes)
// Swagger API documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// Error handling middleware should be after routes to catch errors
app.use(errorLogger) // Logs any unhandled errors

export default app
