import { api } from "@/services/api"
import type { PageResponse } from "@/types/pageResponse"
import type { Customer, CustomerStatus } from "../types/customer"
import type { CustomerFormData } from "../schema/customerSchema";

export const getCustomers = async (
  page: number,
  size: number,
  search?: string,
  status?: CustomerStatus,
) => {
  let query = `?page=${page}&size=${size}`;

  if (search) query += `&search=${search}`;
  if (status) query += `&status=${status}`;

  const response = await api.get(`/customers${query}`);
  return response.data as PageResponse<Customer>;
};

export const addCustomer = async (data: CustomerFormData) => {
  const response = await api.post(`/customers`, data);
  return response.data as Customer;
}

export const updatecustomer = async (customerId: string, data: CustomerFormData) => {
  const response = await api.put(`/customers/${customerId}`, data);
  return response.data as Customer;
}

export const deleteCustomer = async (customerId: string) => {
  const response = await api.delete(`/customers/${customerId}`);
  return response.data;
}