import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5005/api",
  baseURL: "http://13.53.252.170:10000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API RESPONSE ERROR =>", error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("API NO RESPONSE => Server not reachable");
    } else {
      console.error("API CONFIG ERROR =>", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
