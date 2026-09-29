import { api } from "@/services/api";
import { type PageResponse } from "@/types/pageResponse";
import type { Shipment, AddShipmentDto } from "../types/shipment";

export const getAllShipments = async (
  page: number,
  size: number
): Promise<PageResponse<Shipment>> => {
  const response = await api.get(`/shipments`, {
    params: { page, size },
  });
  return response.data;
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  const response = await api.get(`/shipments/${id}`);
  return response.data;
};

export const addShipment = async (data: AddShipmentDto): Promise<Shipment> => {
  const response = await api.post(`/shipments`, data);
  return response.data;
};

export const dispatchShipment = async (id: string): Promise<Shipment> => {
  const response = await api.patch(`/shipments/${id}/dispatch`);
  return response.data;
};

export const deliverShipment = async (id: string): Promise<Shipment> => {
  const response = await api.patch(`/shipments/${id}/deliver`);
  return response.data;
};

export const removeCartonFromShipment = async (
  shipmentId: string,
  cartonId: string
): Promise<Shipment> => {
  const response = await api.delete(`/shipments/${shipmentId}/cartons/${cartonId}`);
  return response.data;
};

export const addCartonToShipment = async (
  shipmentId: string,
  cartonId: string
): Promise<Shipment> => {
  const response = await api.patch(`/shipments/${shipmentId}/cartons/${cartonId}`);
  return response.data;
};

export const deleteShipment = async (id: string): Promise<void> => {
  await api.delete(`/shipments/${id}`);
};
