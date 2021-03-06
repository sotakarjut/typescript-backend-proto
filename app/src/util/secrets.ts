import dotenv from "dotenv";
import fs from "fs";
import logger from "./logger";

// Define env variable keys here.
const sessionSecretKey = "SESSION_SECRET";
const jwtSecretKey = "SESSION_SECRET";
const mongoUriKey = "MONGODB_URI";
const corsOriginKey = "CORS_ORIGIN";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env[sessionSecretKey];
export const MONGODB_URI = process.env[mongoUriKey];
export const ALLOWED_CROSS_ORIGIN = process.env[corsOriginKey];
export const JWT_SECRET = process.env[jwtSecretKey];
if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
