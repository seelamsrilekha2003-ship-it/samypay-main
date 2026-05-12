import axios from "axios";

/*
  ============================
  AXIOS INSTANCE
  ============================
*/
const api = axios.create({
  //baseURL: "http://localhost:5005/api", // backend base URL
  baseURL: "http://13.53.252.170:10000/api",
  //baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api",

  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  ============================
  REQUEST INTERCEPTOR
  ============================
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // attach token only if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // request config error
    return Promise.reject(error);
  },
);

/*
  ============================
  RESPONSE INTERCEPTOR
  ============================
*/
api.interceptors.response.use(
  (response) => {
    // ✅ always return response as-is
    return response;
  },
  (error) => {
    // SERVER RESPONDED WITH ERROR
    if (error.response) {
      const { status, data, config } = error.response;

      console.error("API RESPONSE ERROR ❌", {
        status,
        url: config?.url,
        data,
      });

      // 🔐 Unauthorized → force logout
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // prevent redirect loop
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // ❌ Reject with backend error payload
      return Promise.reject(data);
    }

    // REQUEST SENT BUT NO RESPONSE (server down / CORS / network)
    if (error.request) {
      console.error("NO RESPONSE FROM SERVER ❌", error.request);
      return Promise.reject({
        message: "Server not responding. Please try again.",
      });
    }

    // AXIOS / CONFIG ERROR
    console.error("AXIOS CONFIG ERROR ❌", error.message);
    return Promise.reject({
      message: error.message,
    });
  },
);

/*
  ============================
  EXPORT
  ============================
*/
export default api;
