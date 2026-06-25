import type { LoginRequest } from "@/types/loginRequest"
import { api } from "./api"

export const login = async (data: LoginRequest) => {
    const reponse = await api.post("/auth/login", data)
    return reponse.data
}

export const me = async () => {
    const reponse = await api.get("/auth/me");
    return reponse.data;
}

export const refresh = async () => {
    const response = await api.post("/auth/refresh")
    return response.data;
}

export const logout = async () => {
    const response = await api.post("/auth/logout")
    return response;
}