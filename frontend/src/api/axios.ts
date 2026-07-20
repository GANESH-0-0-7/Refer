import axios from "axios";

/**
 * Base URL
 * Configure in .env
 *
 * VITE_API_BASE_URL=http://localhost:8080/api
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * Axios Instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attach JWT token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized");

          localStorage.removeItem("accessToken");

          window.location.href = "/login";
          break;

        case 403:
          console.error("Access Denied");
          break;

        case 404:
          console.error("Resource Not Found");
          break;

        case 500:
          console.error("Internal Server Error");
          break;

        default:
          console.error(error.response.data?.message || "Unexpected Error");
      }
    } else if (error.request) {
      console.error("Server is not responding.");
    } else {
      console.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default api;