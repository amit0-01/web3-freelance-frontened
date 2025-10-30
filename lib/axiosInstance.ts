"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { storageService } from "../services/storageService";

const apiUrl = 
"http://localhost:8000";
// "https://web3-freelance-backend.onrender.com"
// "http://192.168.31.198:8000"
const axiosInstance = axios.create({
  baseURL: apiUrl,
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
