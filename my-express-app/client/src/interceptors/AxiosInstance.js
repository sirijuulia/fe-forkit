import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response &&
      error.response.status === 401
    ) {
      if (
        error.response.data.message ===
        "jwt expired"
      ) {
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
