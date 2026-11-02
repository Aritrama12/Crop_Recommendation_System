import axios from "axios";

const AnalyticsAPI = axios.create({
  baseURL: "https://cropwise-backend1.onrender.com/api/analytics/",
});

// REQUEST INTERCEPTOR
AnalyticsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
AnalyticsAPI.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          "https://cropwise-backend1.onrender.com/api/token/refresh/",
          {
            refresh,
          }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return AnalyticsAPI(originalRequest);

      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// GET ANALYTICS
export const getAnalytics = () =>
  AnalyticsAPI.get("");

export default AnalyticsAPI;