"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { storageService } from "../services/storageService";

const apiUrl = 
"http://localhost:8000";
// "https://web3-freelance-backend.onrender.com"
// "http://10.121.222.106:8000"

// "https://e327851f671f.ngrok-free.app" 
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Use js-cookie to get the accessToken on the client side
    const userData:any = storageService.getItem("user");
    if(userData){
      const token = userData.accessToken;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No accessToken found in cookies");
      }
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
