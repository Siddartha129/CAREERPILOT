import mongoose from "mongoose";
import { env } from "./env.js";

export const dbState = { mode: "memory", connected: false };

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    dbState.mode = "memory";
    dbState.connected = false;
    return dbState;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    dbState.mode = "mongo";
    dbState.connected = true;
  } catch (error) {
    console.warn("MongoDB unavailable; using in-memory storage.", error.message);
    dbState.mode = "memory";
    dbState.connected = false;
  }

  return dbState;
}
