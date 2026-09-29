import { createColumnHelper } from "@tanstack/react-table";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router";

import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";

import {
  ORDER_STATUS,
  type OrderStatus,
  type OrderSummary,
} from "../types/order";
import { paymentStatusVariant } from "../constants/orderConstants";

import type { Customer } from "@/features/customers/types/customer";

interface OrdersListProps {
  orders: OrderSummary[];
  loading: boolean;

  page: number;
  size: number;
  totalPages: number;
  totalElements: number;

  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;

  statusFilter?: OrderStatus;
  setStatusFilter: (
    status: OrderStatus | undefined,
  ) => void;

  orderSearchInput: string;
  setOrderSearchInput: (value: string) => void;
  onOrderSearch: () => void;

  customerSearch: string;
  setCustomerSearch: (value: string) => void;
  customers: Customer[];
  isCustomerLoading: boolean;
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;

  onClearFilters: () => void;
}

const orderStatusVariant: Record<
  OrderStatus,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  PENDING: "warning",
  PROCESSING: "info",
  PICKED: "info",
  PACKED: "info",
  SHIPPED: "info",
  OUT_FOR_DELIVERY: "info",
  DELIVERED: "primary",
  COMPLETED: "primary",
  CANCELLED: "error",
  FAILED: "error",
  RETURNED: "warning",
};

function OrdersList({
  orders,
  loading,

  page,
  size,
  totalPages,
  totalElements,

  onPageChange,
  onSizeChange,

  statusFilter,
  setStatusFilter,

  orderSearchInput,
  setOrderSearchInput,
  onOrderSearch,

  customerSearch,
  setCustomerSearch,
  customers,
  isCustomerLoading,
  selectedCustomer,
  onCustomerSelect,

  onClearFilters,
}: OrdersListProps) {
  const navigate = useNavigate();

  const columnHelper = createColumnHelper<OrderSummary>();

  const columns = [
    columnHelper.display({
      id: "order",
      header: "Order",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {order.orderNumber}
            </span>

            <span className="text-xs text-muted-foreground">
              {new Date(
                order.orderDate,
              ).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        );
      },
    }),

    columnHelper.display({
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;

        const initial =
          order.receiverName
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "?";

        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {order.receiverName}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatEnum(order.priority)} priority
              </p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();

        return (
          <StatusBadge
            label={formatEnum(status)}
            variant={orderStatusVariant[status]}
          />
        );
      },
    }),

    columnHelper.accessor("paymentStatus", {
      header: "Payment",
      cell: (info) => {
        const paymentStatus = info.getValue();

        return (
          <StatusBadge
            label={formatEnum(paymentStatus)}
            variant={paymentStatusVariant[paymentStatus]}
          />
        );
      },
    }),

    columnHelper.accessor("totalAmount", {
      header: "Total",
      cell: (info) => (
        <span className="font-medium tabular-nums">
          ₹{Number(info.getValue()).toLocaleString()}
        </span>
      ),
    }),
  ];

  const hasFilters =
    !!statusFilter ||
    !!orderSearchInput ||
    !!selectedCustomer;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-5">
      {/* Filters / Actions */}
      <div className="rounded-xl border bg-card p-3">
        <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
          {/* Order number search */}
          <div className="relative flex-1">
            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              value={orderSearchInput}
              onChange={(e) =>
                setOrderSearchInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onOrderSearch();
                }
              }}
              placeholder="Search order number..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          {/* Customer search */}
          <div className="relative flex-1">
            <Search
              className="
                absolute
                left-3
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              value={customerSearch}
              onChange={(e) =>
                setCustomerSearch(e.target.value)
              }
              placeholder="Search customer..."
              className="h-9 pl-9 pr-8 text-xs"
            />

            {isCustomerLoading && (
              <Loader2
                className="
                  absolute
                  right-3
                  top-1/2
                  h-3.5
                  w-3.5
                  -translate-y-1/2
                  animate-spin
                  text-muted-foreground
                "
              />
            )}

            {/* Customer suggestions */}
            {customerSearch &&
              customers.length > 0 &&
              !selectedCustomer && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
                    z-50
                    mt-1
                    max-h-52
                    overflow-auto
                    rounded-lg
                    border
                    bg-popover
                    p-1
                    shadow-lg
                  "
                >
                  {customers.map((customer) => (
                    <button
                      key={customer.customerId}
                      type="button"
                      onClick={() =>
                        onCustomerSelect(customer)
                      }
                      className="
                        flex
                        w-full
                        flex-col
                        items-start
                        rounded-md
                        px-3
                        py-2
                        text-left
                        transition-colors
                        hover:bg-accent
                      "
                    >
                      <span className="text-xs font-semibold">
                        {customer.customerName}
                      </span>

                      <span className="text-[10px] text-muted-foreground">
                        {customer.city}

                        {customer.contactNumber
                          ? ` · ${customer.contactNumber}`
                          : ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Status */}
          <Select
            value={statusFilter ?? "NONE"}
            onValueChange={(value) =>
              setStatusFilter(
                value === "NONE"
                  ? undefined
                  : (value as OrderStatus),
              )
            }
          >
            <SelectTrigger className="h-9 w-full text-xs xl:w-[170px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="NONE">
                No status filter
              </SelectItem>

              {ORDER_STATUS.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                >
                  {formatEnum(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClearFilters}
              className="h-9 w-9 shrink-0"
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Create Order */}
          <Button
            type="button"
            onClick={() =>
              navigate("/app/orders/add")
            }
            className="h-9 shrink-0 gap-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Selected customer */}
      {selectedCustomer && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Showing orders for</span>

          <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
            {selectedCustomer.customerName}
          </span>
        </div>
      )}

      {/* Order count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {totalElements}{" "}
          {totalElements === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={orders}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
            page={page}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
            onRowClick={(order) =>
              navigate(
                `/app/orders/${order.orderId}`,
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default OrdersList;