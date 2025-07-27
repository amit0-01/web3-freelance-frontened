"use client";
import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = 
"http://localhost:8000";
// "https://web3-freelance-backend.onrender.com"
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || apiUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Use js-cookie to get the accessToken on the client side
    const token = Cookies.get("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("No accessToken found in cookies");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
