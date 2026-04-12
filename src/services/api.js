import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // ✅ read directly from localStorage as fallback
  // in case Zustand hasn't rehydrated yet
  let token = useAuthStore.getState().token;

  if (!token) {
    try {
      const persisted = localStorage.getItem("nova-vet-auth");
      if (persisted) {
        const parsed = JSON.parse(persisted);
        token = parsed?.state?.token;
      }
    } catch (e) {
      console.error("Failed to read token from localStorage", e);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
