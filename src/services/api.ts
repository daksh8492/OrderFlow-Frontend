import axios from "axios";
import { store } from "@/store/store";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.request.use( (config) => {

  const token = store.getState().auth.accessToken;

  if(token) config.headers.Authorization = `Bearer ${token}`

  return config;
})