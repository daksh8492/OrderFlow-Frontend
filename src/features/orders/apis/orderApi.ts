import { api } from "@/services/api";
import type { Order, OrderStatus, OrderSummary } from "../types/order";
import type { PageResponse } from "@/types/pageResponse";
import type { OrderFormData } from "../schema/orderSchema";

export const getOrders = async (
  page = 0,
  size = 20,
  sort?: string,
): Promise<PageResponse<OrderSummary>> => {
  const response = await api.get(`/orders`, {
    params: {
      page,
      size,
      sort,
    },
  });
  return response.data as PageResponse<OrderSummary>;
};

export const getOrdersByStatus = async (
  status: OrderStatus,
  page = 0,
  size = 20,
) => {
  const response = await api.get(`/orders/status/${status}`, {
    params: {
      page,
      size,
    },
  });
  return response.data as PageResponse<OrderSummary>;
};

export const getOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data as Order;
};

export const getOrderByOrderNumber = async (orderNumber: string) => {
  const response = await api.get(`/orders/order-number/${orderNumber}`);
  return response.data;
};

export const createOrder = async (
  order: OrderFormData
): Promise<Order> => {
  const response = await api.post(`/orders`, order);
  return response.data as Order;
};

export const updateOrder = async (
  orderId: string,
  order: OrderFormData
): Promise<Order> => {
  const response = await api.put(`/orders/${orderId}`, order);
  return response.data as Order;
};

export const assignWarehouse = async (
  orderId: string,
  warehouseId: string
): Promise<Order> => {
  const response = await api.patch(`/orders/${orderId}/assign-warehouse/${warehouseId}`);
  return response.data as Order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  const response = await api.patch(`/orders/${orderId}/status/${status}`);
  return response.data as Order;
};

// export const deleteOrder = async (
//   orderId: string
// ): Promise<void> => {
//   await axiosInstance.delete(`${BASE_URL}/${orderId}`);
// };

// export const cancelOrder = async (
//   orderId: string
// ): Promise<Order> => {
//   const { data } = await axiosInstance.patch(
//     `${BASE_URL}/${orderId}/cancel`
//   );

//   return data;
// };

// export const updatePaymentStatus = async (
//   orderId: string,
//   status: PaymentStatus
// ): Promise<Order> => {
//   const { data } = await axiosInstance.patch(
//     `${BASE_URL}/${orderId}/payment-status/${status}`
//   );

//   return data;
// };

export const getOrdersByCustomerId = async (
  customerId: string,
  page = 0,
  size = 20
): Promise<PageResponse<OrderSummary>> => {
  const { data } = await api.get(`/orders/customer/${customerId}`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return data;
};

export const getPickableOrders = async (
  page = 0,
  size = 20
): Promise<PageResponse<OrderSummary>> => {
  const response = await api.get(`/orders/pickable`, {
    params: {
      page,
      size,
    },
  });
  return response.data as PageResponse<OrderSummary>;
};
