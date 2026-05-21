

import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/soil/",
});

// =======================
// REQUEST INTERCEPTOR
// =======================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =======================
// RESPONSE INTERCEPTOR (IMPORTANT FIX)
// =======================
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          throw new Error("No refresh token");
        }

        // get new access token
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        // save new token
        localStorage.setItem("access", newAccess);

        // update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        // refresh also expired → logout user
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// =======================
// API CALLS
// =======================
export const soilAPI = {
  getSummary: () => API.get("health-summary/"),
  getCurrent: () => API.get("current/"),
  getHistory: () => API.get("history/"),
  getRecommendations: () => API.get("recommendations/"),
  createTest: (data) => API.post("tests/", data),

  analyzeImage: (formData) =>
    API.post("image-analyze/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default API;