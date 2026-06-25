import { api } from "@/services/api"
import type { PageResponse } from "@/types/pageResponse";
import type { Warehouse } from "../types/warehouse";

export const getWarehouses = async (page: number, size: number) => {
    const response = await api.get(`/warehouses?page=${page}&size=${size}`);
    return response.data as PageResponse<Warehouse>
}