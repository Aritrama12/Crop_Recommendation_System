
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/soil/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access"); // changed

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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