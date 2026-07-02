import { api } from "@/services/api";
import type { Vendor, VendorStatus} from "../types/vendor";
import type { PageResponse } from "@/types/pageResponse";
import type { VendorFormData } from "../schema/vendorSchema";

export const getVendors = async (
  page: number,
  size: number,
  search?: string,
  status?: VendorStatus,
) => {
  let query = `?page=${page}&size=${size}`;
  if (search) query += `&search=${encodeURIComponent(search)}`;
  if (status) query += `&status=${status}`;
  const response = await api.get(`/vendors${query}`);
  return response.data as PageResponse<Vendor>;
};

export const addVendor = async (vendor: VendorFormData) => {
  const response = await api.post("/vendors", vendor);
  return response.data as Vendor;
}

export const updateVendor = async(vendorId: string, vendor: VendorFormData) => {
  const response = await api.put(`/vendors/${vendorId}`, vendor);
  return response.data as Vendor;
}

export const deleteVendor = async (vendorid: string) => {
  const response = await api.delete(`/vendors/${vendorid}`);
  return response.data;
}