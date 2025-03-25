import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8888",
  // baseURL: "https://interview-backend-zswx.onrender.com",
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
