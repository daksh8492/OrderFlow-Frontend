import { api } from "@/services/api";
import type { PageResponse } from "@/types/pageResponse";
import type {
  InwardSource,
  Item,
  ItemCategory,
  ItemStatus,
  ItemSummary,
  Variant,
} from "../types/item";
import type { ItemFormData } from "../schema/itemSchema";

export const getItems = async (
  page: number,
  size: number,
  search?: string,
  category?: ItemCategory,
  status?: ItemStatus,
  sourceType?: InwardSource,
) => {
  let query = `?page=${page}&size=${size}`;

  if (search) query += `&search=${search}`;
  if (category) query += `&category=${category}`;
  if (status) query += `&status=${status}`;
  if (sourceType) query += `&sourceType=${sourceType}`;

  const response = await api.get(`/items${query}`);
  return response.data as PageResponse<ItemSummary>;
};

export const deleteItem = async (id: string) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

export const activateItem = async (id: string) => {
  const response = await api.patch(`/items/${id}/activate`);
  return response;
};

export const deactivateItem = async (id: string) => {
  const response = await api.patch(`/items/${id}/deactivate`);
  return response;
};

export const discontinueItem = async (id: string) => {
  const response = await api.patch(`/items/${id}/discontinue`);
  return response;
};

export const addItem = async (data: ItemFormData) => {
  const response = await api.post(`/items`, data);
  return response.data as Item;
};

export const updateItem = async (id: string, data: ItemFormData) => {
  const response = await api.put(`/items/${id}`, data);
  return response;
};

export const getItemById = async (id: string) => {
  const response = await api.get(`/items/${id}`);
  return response.data as Item;
};

export const addVariant = async (data: {
  name: string;
  sellingPrice: number;
  purchasePrice: number;
  attributes: { [k: string]: string; };
  imageUrls?: string[] | undefined;
  itemId?: string;
}) => {
  const response = await api.post(`/variants`, data);
  return response.data as Variant;
};

export const updateVariant = async (variantId: string, data: {
  name: string;
  sellingPrice: number;
  purchasePrice: number;
  attributes: { [k: string]: string; };
  imageUrls?: string[] | undefined;
  itemId?: string;
}) => {
  const response = await api.put(`/variants/${variantId}`, data);
  return response.data as Variant;
};

export const deleteVariant = async (variantId: string) => {
  const response = await api.delete(`/variants/${variantId}`);
  return response.data;
}

export const activateVariant = async (variantId: string) => {
  const response = await api.patch(`/variants/${variantId}/activate`);
  return response;
};

export const deactivateVariant = async (variantId: string) => {
  const response = await api.patch(`/variants/${variantId}/deactivate`);
  return response;
};

export const discontinueVariant = async (variantId: string) => {
  const response = await api.patch(`/variants/${variantId}/discontinue`);
  return response;
};