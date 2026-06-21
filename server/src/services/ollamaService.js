import axios from "axios";
import { env } from "../config/env.js";

export async function generateLocalText(prompt) {
  try {
    const { data } = await axios.post(`${env.OLLAMA_BASE_URL}/api/generate`, {
      model: env.OLLAMA_CHAT_MODEL,
      prompt,
      stream: false
    }, { timeout: 8000 });
    return String(data?.response || "").trim();
  } catch {
    return "";
  }
}

export async function generateEmbedding(text) {
  try {
    const { data } = await axios.post(`${env.OLLAMA_BASE_URL}/api/embeddings`, {
      model: env.OLLAMA_EMBED_MODEL,
      prompt: text
    }, { timeout: 8000 });
    return Array.isArray(data?.embedding) ? data.embedding : [];
  } catch {
    return [];
  }
}
