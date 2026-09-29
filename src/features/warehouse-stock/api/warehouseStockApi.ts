import { api } from "@/services/api";
import { type PageResponse } from "@/types/pageResponse";

export interface WarehouseStock {
  stockId?: string;
  warehouseStockId?: string;
  warehouseId: string;
  variantId: string;
  locationId?: string;
  warehouseLocationId?: string;
  totalQuantity: number;
  location?: {
    locationId: string;
    code: string;
    locationName: string;
  } | null;
}

export const getWarehouseStocksByVariant = async (
  variantId: string
): Promise<PageResponse<WarehouseStock>> => {
  const response = await api.get(`/stocks/variant/${variantId}`, {
    params: {
      size: 100,
    },
  });
  return response.data as PageResponse<WarehouseStock>;
};

export const getStocksByLocation = async (
  locationId: string,
  page = 0,
  size = 20
): Promise<PageResponse<WarehouseStock>> => {
  const response = await api.get(`/stocks/location/${locationId}`, {
    params: {
      page,
      size,
    },
  });
  return response.data as PageResponse<WarehouseStock>;
};

export const addStock = async (stock: {
  warehouseId: string;
  variantId: string;
  locationId?: string;
  warehouseLocationId?: string;
  totalQuantity: number;
}): Promise<WarehouseStock> => {
  const response = await api.post("/stocks", stock);
  return response.data as WarehouseStock;
};

export const updateStock = async (
  stockId: string,
  quantity: number
): Promise<WarehouseStock> => {
  const response = await api.put(`/stocks/${stockId}`, quantity, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as WarehouseStock;
};

export const deleteStock = async (stockId: string): Promise<any> => {
  const response = await api.delete(`/stocks/${stockId}`);
  return response.data;
};
