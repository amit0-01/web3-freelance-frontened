import axios from "axios";
import { storageService } from "./storageService";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

let requestCount = 0;

const showLoader = () => {
  requestCount++;
  if (requestCount === 1) {
    document.body.classList.add("loading"); 
  }
};

const hideLoader = () => {
  requestCount--;
  if (requestCount === 0) {
    document.body.classList.remove("loading"); 
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    // showLoader()

    const user:any = storageService.getItem("user") // Get user from storage
    const token = user?.accessToken // Extract accessToken

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // hideLoader()
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

export default axiosInstance;
