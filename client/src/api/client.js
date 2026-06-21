import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl.endsWith("/api") ? apiBaseUrl : `${apiBaseUrl}/api`
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) useAuthStore.getState().logout();
  return Promise.reject(error);
});
