// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "",
//   timeout: 10000,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("authToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.isRefreshing = false;
    this.failedQueue = [];

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  /* ================= REQUEST INTERCEPTOR ================= */
  initializeRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("Token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  /* ================= HANDLE QUEUE ================= */
  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /* ================= RESPONSE INTERCEPTOR ================= */
  initializeResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => response.data, // ✅ clean response
      async (error) => {
        const originalRequest = error.config;

        // ✅ Handle token expiration (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");

            // 🔁 Call refresh token API
            const res = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
              { refreshToken },
            );

            const newToken = res.data.accessToken;

            localStorage.setItem("authToken", newToken);

            this.client.defaults.headers.Authorization = `Bearer ${newToken}`;

            this.processQueue(null, newToken);
            this.isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (err) {
            this.processQueue(err, null);
            this.isRefreshing = false;

            // ❌ logout if refresh fails
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";

            return Promise.reject(err);
          }
        }

        /* ================= OTHER ERRORS ================= */
        if (error.response) {
          console.error("API Error:", error.response.data);
          return Promise.reject(error.response.data);
        }

        if (error.request) {
          console.error("Network Error");
          return Promise.reject("Network Error");
        }

        return Promise.reject(error.message);
      },
    );
  }

  /* ================= METHODS ================= */
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

/* ================= EXPORT ================= */
const apiClient = new ApiClient();
export default apiClient;
