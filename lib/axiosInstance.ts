import axios from "axios";
import { storageService } from "../services/storageService";

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const userData: any = storageService.getItem("user");
    const tokenExpiry = storageService.getItem<number>("tokenExpiry");

    // 🔥 Check expiry
    if (tokenExpiry && Date.now() > tokenExpiry) {
      storageService.clearStorage();
      if (typeof window !== "undefined") {
        window.location.href = "auth/login";
      }
      return Promise.reject("Token expired");
    }
    if (userData?.accessToken) {
      config.headers["Authorization"] = `Bearer ${userData.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;