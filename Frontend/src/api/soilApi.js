import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/soil/",
});

export const soilAPI = {
  // summary
  getSummary: () => API.get("health-summary/"),

  // current
  getCurrent: () => API.get("current/"),

  // history
  getHistory: () => API.get("history/"),

  // recommendations
  getRecommendations: () => API.get("recommendations/"),

  // create test
  createTest: (data) => API.post("tests/", data),

  // image analyze
  analyzeImage: (formData) =>
    API.post("image-analyze/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};