// src/lib/api.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://mern-notes-backend-j9dn.onrender.com/api";

// ✅ Debug: log baseURL in console (only in development or once in production)
if (typeof window !== "undefined") {
  console.log("🔗 API Base URL:", baseURL);
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Response interceptor: unwrap { success, data } automatically
api.interceptors.response.use(
  (response) => {
    const resData = response?.data;
    if (
      resData &&
      typeof resData === "object" &&
      "success" in resData &&
      "data" in resData
    ) {
      return { ...response, data: resData.data }; // now api.get/post returns data directly
    }
    return response;
  },
  (error) => {
    const msg =
      error?.response?.data?.message || error?.message || "Request failed";
    return Promise.reject(new Error(msg)); // always throw Error
  }
);

// Optional: helper to attach token automatically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;