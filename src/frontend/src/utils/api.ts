import axios, { type InternalAxiosRequestConfig } from "axios";

export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: BASE_API_URL
});
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

const handleHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// ✅ Register the interceptor
api.interceptors.request.use(
  handleHeaders, // on success
  (error) => Promise.reject(error) // on error
);

export default api;
