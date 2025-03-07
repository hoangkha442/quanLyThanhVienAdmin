import { userLocalStorage } from "@/services/LocalService";
import axios from "axios";

export const https = axios.create({
  baseURL: "http://localhost:8080/",
});

https.interceptors.request.use((config) => {
  const token = userLocalStorage.get()?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


