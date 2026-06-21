import dotenv from "dotenv";

dotenv.config();

const list = (value = "") => value.split(",").map((item) => item.trim()).filter(Boolean);

export const env = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  CLIENT_URLS: list(process.env.CLIENT_URLS || ""),
  MONGODB_URI: process.env.MONGODB_URI || "",
  USE_MONGODB: process.env.USE_MONGODB === "true",
  JWT_SECRET: process.env.JWT_SECRET || "careerpilot-local-development-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  OLLAMA_CHAT_MODEL: process.env.OLLAMA_CHAT_MODEL || "llama3.1:8b",
  OLLAMA_EMBED_MODEL: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || "",
  SEED_SAMPLE_DATA: process.env.SEED_SAMPLE_DATA === "true",
  ENABLE_LIVE_DISCOVERY: process.env.ENABLE_LIVE_DISCOVERY !== "false",
  NODE_ENV: process.env.NODE_ENV || "development"
};

export const allowedOrigins = [env.CLIENT_URL, ...env.CLIENT_URLS].filter(Boolean);
