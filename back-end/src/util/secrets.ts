import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  logger.debug(
    "Using .env.example file to supply config environment variables"
  );
  dotenv.config({ path: ".env" });
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

const SESSION_SECRET_ENV = process.env["SESSION_SECRET"];
const MONGODB_URI_ENV = prod
  ? process.env["MONGODB_URI"]
  : process.env["MONGODB_URI_LOCAL"];

if (!SESSION_SECRET_ENV) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

if (!MONGODB_URI_ENV) {
  if (prod) {
    logger.error(
      "No mongo connection string. Set MONGODB_URI environment variable."
    );
  } else {
    logger.error(
      "No mongo connection string. Set MONGODB_URI_LOCAL environment variable."
    );
  }
  process.exit(1);
}

export const MONGODB_URI = MONGODB_URI_ENV!;
export const SESSION_SECRET = SESSION_SECRET_ENV!;
