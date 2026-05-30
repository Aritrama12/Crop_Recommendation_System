import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/records/",
});



// REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// RESPONSE INTERCEPTOR
API.interceptors.response.use(
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
          throw new Error("No refresh token found");
        }

        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh,
          }
        );

        const newAccess = res.data.access;

        localStorage.setItem(
          "access",
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return API(originalRequest);
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

// PLANTINGS

export const getPlantings = () =>
  API.get("plantings/");

export const createPlanting = (data) =>
  API.post("plantings/", data);

export const updatePlanting = (id, data) =>
  API.put(`plantings/${id}/`, data);

export const deletePlanting = (id) =>
  API.delete(`plantings/${id}/`);


// HARVESTS

export const getHarvests = () =>
  API.get("harvests/");

export const createHarvest = (data) =>
  API.post("harvests/", data);

export const updateHarvest = (id, data) =>
  API.put(`harvests/${id}/`, data);

export const deleteHarvest = (id) =>
  API.delete(`harvests/${id}/`);


// SALES

export const getSales = () =>
  API.get("sales/");

export const createSale = (data) =>
  API.post("sales/", data);

export const updateSale = (id, data) =>
  API.put(`sales/${id}/`, data);

export const deleteSale = (id) =>
  API.delete(`sales/${id}/`);


// EXPENSES

export const getExpenses = () =>
  API.get("expenses/");

export const createExpense = (data) =>
  API.post("expenses/", data);

export const updateExpense = (id, data) =>
  API.put(`expenses/${id}/`, data);

export const deleteExpense = (id) =>
  API.delete(`expenses/${id}/`);


// RESOURCES

export const getResources = () =>
  API.get("resources/");

export const createResource = (data) =>
  API.post("resources/", data);

export const updateResource = (id, data) =>
  API.put(`resources/${id}/`, data);

export const deleteResource = (id) =>
  API.delete(`resources/${id}/`);


// DEFAULT EXPORT

export default API;