// src/lib/api.ts
import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
  withCredentials: true, // ✅ send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Request interceptor (for adding tokens or logging)
api.interceptors.request.use(
  (config) => {
    // Example: attach custom header if needed
    // config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor (for global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: automatically logout if 401 (unauthorized)
    if (error.response?.status === 401) {
      console.warn("Session expired or unauthorized. Redirecting to login...");
      // you can clear user context or redirect here
    }
    return Promise.reject(error);
  }
);

export default api;
