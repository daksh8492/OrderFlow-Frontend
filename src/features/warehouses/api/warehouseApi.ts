import { api } from "@/services/api"
import type { PageResponse } from "@/types/pageResponse";
import type { Warehouse, WarehouseStatus } from "../types/warehouse";
import type { WarehouseFormData } from "../schema/warehouseSchema";

export const getWarehouses = async (page: number, size: number) => {
    const response = await api.get(`/warehouses?page=${page}&size=${size}`);
    return response.data as PageResponse<Warehouse>
}

export const createWarehouse = async (data: WarehouseFormData) => {
    const response = await api.post("/warehouses", data);
    return response.data as Warehouse
}

export const deleteWarehouse = async (warehouseId: string) => {
    const response = await api.delete(`/warehouses/${warehouseId}`)
    return response.data;
}

export const updateWarehouse = async (data: WarehouseFormData, warehouseId: string) => {
    const response = await api.put(`/warehouses/${warehouseId}`, data);
    return response.data as Warehouse;
}

export const updateWarehouseStatus = async (warehouseId: string, status: WarehouseStatus) => {
    const response = await api.patch(`/warehouses/${warehouseId}/status/${status}`);
    return response.data as Warehouse;
}