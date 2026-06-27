import { api } from "@/services/api";
import type { Location, LocationType } from "../types/location";

export const getRootLocations = async (warehouseId: string) => {
  const response = await api.get(`/locations/warehouse/${warehouseId}`);
  return response.data as Location[];
};

export const getChildLocations = async (locationId: string) => {
  const response = await api.get(`/locations/${locationId}/children`);
  return response.data as Location[];
};

export const addLocation = async (locationDto: {
  warehouseId: string;
  locationType: LocationType;
  parentLocationId?: string;
}) => {
  const response = await api.post(`/locations`, locationDto);
  return response.data as Location;
};

export const activateLocation = async (locationId: string) => {
  const response = await api.patch(`/locations/${locationId}/activate`);
  return response.data as Location;
};

export const deactivateLocation = async (locationId: string) => {
  const response = await api.patch(`/locations/${locationId}/deactivate`);
  return response.data as Location;
};

export const deleteLocation = async (locationId: string) => {
  const response = await api.delete(`/locations/${locationId}`);
  return response.data;
};