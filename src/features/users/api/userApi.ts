import { api } from "@/services/api";
import type { PageResponse } from "@/types/pageResponse";
import type { FieldOfWork, User } from "../types/user";
import type { UserFormData } from "../schema/userSchema";

export const getUsers = async (page: number, size: number) => {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return response.data as PageResponse<User>;
}

export const createUser = async (userData: UserFormData) => {
    const response = await api.post("/users", userData);
    return response.data as User;
}

export const updateUser = async (userId: string, userData: UserFormData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data as User;
}

export const activateUser = async (userId: string) => {
    const response = await api.patch(`/users/activate/${userId}`)
    return response;
}

export const deactivateUser = async (userId: string) => {
    const response = await api.patch(`/users/deactivate/${userId}`)
    return response;
}

export const searchUsers = async (query: string, page: number, size: number) => {
    const response = await api.get(`/users/search?query=${query}&page=${page}&size=${size}`)
    return response.data as PageResponse<User>
}

export const getUsersByFieldOfWork = async (fow: FieldOfWork, page: number, size: number) => {
    const response = await api.get(`/users/fieldOfWork/${fow}?page=${page}&size=${size}`)
    return response.data as PageResponse<User>
}

export const joinUser = async (userId: string) => {
    const response = await api.patch(`/users/join/${userId}`)
    return response.data;
}

export const deleteUser = async (userId: string) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data;
}