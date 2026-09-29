import { api } from "@/services/api";
import { type PageResponse } from "@/types/pageResponse";
import type { Carton, AddCartonDto } from "../types/carton";

export const getCartons = async (
  page: number,
  size: number
): Promise<PageResponse<Carton>> => {
  const response = await api.get(`/cartons`, {
    params: { page, size },
  });
  return response.data;
};

export const getCartonById = async (id: string): Promise<Carton> => {
  const response = await api.get(`/cartons/${id}`);
  return response.data;
};

export const getCartonsByWarehouseId = async (
  warehouseId: string,
  page: number,
  size: number
): Promise<PageResponse<Carton>> => {
  const response = await api.get(`/cartons/warehouse/${warehouseId}`, {
    params: { page, size },
  });
  return response.data;
};

export const getCartonsByPickingId = async (
  pickingId: string
): Promise<Carton[]> => {
  const response = await api.get(`/cartons/picking/${pickingId}`);
  return response.data;
};

export const getCartonsByOrderId = async (
  orderId: string
): Promise<Carton[]> => {
  const response = await api.get(`/cartons/orders/${orderId}`);
  return response.data;
};

export const getCartonsByPackerId = async (
  packerId: string
): Promise<Carton[]> => {
  const response = await api.get(`/cartons/packer/${packerId}`);
  return response.data;
};

export const addCarton = async (data: AddCartonDto): Promise<Carton> => {
  const response = await api.post(`/cartons`, data);
  return response.data;
};

export const updateCarton = async (
  id: string,
  data: Partial<AddCartonDto>
): Promise<Carton> => {
  const response = await api.put(`/cartons/${id}`, data);
  return response.data;
};

export const deleteCarton = async (id: string): Promise<void> => {
  await api.delete(`/cartons/${id}`);
};
