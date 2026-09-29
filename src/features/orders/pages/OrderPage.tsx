import { useEffect, useState } from "react";
import {
  getOrders,
  getOrdersByCustomerId,
  getOrderByOrderNumber,
  getOrdersByStatus,
} from "../apis/orderApi";

import { getCustomers, getCustomerById } from "@/features/customers/api/customerApi";

import { type PageResponse } from "@/types/pageResponse";
import {
  type OrderStatus,
  type OrderSummary,
} from "../types/order";

import type { Customer } from "@/features/customers/types/customer";

import OrdersList from "../components/OrdersList";

function OrderPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [statusFilter, setStatusFilter] =
    useState<OrderStatus>();

  const [orderNumberSearch, setOrderNumberSearch] =
    useState("");

  const [orderSearchInput, setOrderSearchInput] =
    useState("");

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);

  const [ordersPage, setOrdersPage] =
    useState<PageResponse<OrderSummary>>();

  const [loading, setLoading] = useState(false);

  /*
   * Customer autocomplete
   */
  useEffect(() => {
    if (!customerSearch.trim()) {
      setCustomers([]);
      setIsCustomerLoading(false);
      return;
    }

    const fetchCustomers = async () => {
      setIsCustomerLoading(true);

      try {
        const response = await getCustomers(
          0,
          10,
          customerSearch.trim(),
        );

        setCustomers(response.content ?? []);
      } catch (error) {
        console.error(
          "Failed to search customers:",
          error,
        );

        setCustomers([]);
      } finally {
        setIsCustomerLoading(false);
      }
    };

    const debounce = setTimeout(fetchCustomers, 400);

    return () => clearTimeout(debounce);
  }, [customerSearch]);

  /*
   * Fetch orders
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        let response;

        /*
         * Exact order number
         */
        if (orderNumberSearch.trim()) {
          const order =
            await getOrderByOrderNumber(
              orderNumberSearch.trim(),
            );

          setOrdersPage({
            content: [order],
            totalElements: 1,
            totalPages: 1,
            size: 1,
            number: 0,
            first: true,
            last: true,
            empty: false,
          });

          return;
        }

        /*
         * Customer
         */
        if (selectedCustomer) {
          response = await getOrdersByCustomerId(
            selectedCustomer.customerId,
            page,
            size,
          );
        }

        /*
         * Status
         */
        else if (statusFilter) {
          response = await getOrdersByStatus(
            statusFilter,
            page,
            size,
          );
        }

        /*
         * All orders
         */
        else {
          response = await getOrders(page, size);
        }

        setOrdersPage(response);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error,
        );

        setOrdersPage(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    page,
    size,
    statusFilter,
    orderNumberSearch,
    selectedCustomer,
  ]);

  /*
   * Order number search
   */
  const handleOrderSearch = () => {
    const value = orderSearchInput.trim();

    setPage(0);

    if (!value) {
      setOrderNumberSearch("");
      return;
    }

    setSelectedCustomer(null);
    setCustomerSearch("");
    setStatusFilter(undefined);

    setOrderNumberSearch(value);
  };

  /*
   * Status
   */
  const handleStatusChange = (
    status: OrderStatus | undefined,
  ) => {
    setPage(0);

    setOrderNumberSearch("");
    setOrderSearchInput("");

    setSelectedCustomer(null);
    setCustomerSearch("");

    setStatusFilter(status);
  };

  /*
   * Customer selection
   */
  // const handleCustomerSelect = (
  //   customer: Customer,
  // ) => {
  //   setSelectedCustomer(customer);

  //   setCustomerSearch(customer.customerName);

  //   setPage(0);

  //   setOrderNumberSearch("");
  //   setOrderSearchInput("");

  //   setStatusFilter(undefined);

  //   setCustomers([]);
  // };

  const handleCustomerSelect = async (customer: Customer) => {
    try {
      setIsCustomerLoading(true);

      const fullCustomer = await getCustomerById(
        customer.customerId,
      );

      setSelectedCustomer(fullCustomer);
      setCustomerSearch(fullCustomer.customerName);
      setCustomers([]);

      setPage(0);

      setOrderNumberSearch("");
      setOrderSearchInput("");
      setStatusFilter(undefined);
    } catch (error) {
      console.error("Failed to load customer:", error);
    } finally {
      setIsCustomerLoading(false);
    }
  };

  /*
   * Clear everything
   */
  const handleClearFilters = () => {
    setOrderSearchInput("");
    setOrderNumberSearch("");

    setCustomerSearch("");
    setSelectedCustomer(null);
    setCustomers([]);

    setStatusFilter(undefined);

    setPage(0);
  };

  return (
    <OrdersList
      orders={ordersPage?.content ?? []}
      loading={loading}
      page={page}
      size={size}
      totalElements={ordersPage?.totalElements ?? 0}
      totalPages={ordersPage?.totalPages ?? 0}
      statusFilter={statusFilter}
      setStatusFilter={handleStatusChange}
      onPageChange={setPage}
      onSizeChange={setSize}

      orderSearchInput={orderSearchInput}
      setOrderSearchInput={setOrderSearchInput}
      onOrderSearch={handleOrderSearch}

      customerSearch={customerSearch}
      setCustomerSearch={setCustomerSearch}
      customers={customers}
      isCustomerLoading={isCustomerLoading}
      selectedCustomer={selectedCustomer}
      onCustomerSelect={handleCustomerSelect}

      onClearFilters={handleClearFilters}
    />
  );
}

export default OrderPage;