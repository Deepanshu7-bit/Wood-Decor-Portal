import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/woods_decor",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_key_12345",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
