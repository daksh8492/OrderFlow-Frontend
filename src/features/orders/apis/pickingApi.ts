import { api } from "@/services/api";
import { type PageResponse } from "@/types/pageResponse";

export interface PickingItemDto {
  pickingItemId?: string;
  pickingId?: string;
  orderItemId: string;
  pickedItems: number;
  warehouseStockId: string;
}

export interface PickingDto {
  pickingId?: string;
  pickerId?: string;
  orderId: string;
  warehouseId?: string;
  pickingItems: PickingItemDto[];
  totalItems: number;
  createdAt?: string;
}

export interface PickingSummaryDto {
  pickingId: string;
  pickerName: string;
  orderNumber: string;
  warehouseName: string;
  totalItems: number;
  createdAt: string;
}

export const createPicking = async (picking: PickingDto): Promise<PickingDto> => {
  const response = await api.post("/pickings", picking);
  return response.data as PickingDto;
};

export const getPickingByOrderId = async (orderId: string): Promise<PickingDto> => {
  const response = await api.get(`/pickings/order/${orderId}`);
  return response.data as PickingDto;
};

export const getPickingById = async (pickingId: string): Promise<PickingDto> => {
  const response = await api.get(`/pickings/${pickingId}`);
  return response.data as PickingDto;
};

export const getPickingsByWarehouse = async (
  warehouseId: string,
  page = 0,
  size = 20
): Promise<PageResponse<PickingSummaryDto>> => {
  const response = await api.get(`/pickings/warehouse/${warehouseId}`, {
    params: {
      page,
      size,
    },
  });
  return response.data as PageResponse<PickingSummaryDto>;
};

export const deletePicking = async (pickingId: string): Promise<void> => {
  await api.delete(`/pickings/${pickingId}`);
};
