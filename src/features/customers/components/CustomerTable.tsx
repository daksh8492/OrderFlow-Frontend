import { createColumnHelper } from "@tanstack/react-table";
import type { Customer, CustomerStatus } from "../types/customer";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import DataTable from "@/components/common/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2 } from "lucide-react";
import EditCustomerDialog from "./EditCustomerDialog";
import type { CustomerFormData } from "../schema/customerSchema";

const customerStatusVariant: Record<
  CustomerStatus,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  ACTIVE: "primary",
  INACTIVE: "neutral",
  CLOSED: "error",
};

function CustomerTable(props: {
  customers: Customer[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  handleEditCustomer: (customerId: string, customer: CustomerFormData) => void;
  //   handleDeactivateCustomer: (customerId: string) => void;
  //   handleActivateCustomer: (customerId: string) => void;
  //   handleJoinCustomer: (customerId: string) => void;
  handleDeleteCustomer: (customerId: string) => void;
}) {
  const {
    customers,
    onPageChange,
    onSizeChange,
    totalElements,
    totalPages,
    page,
    size,
    handleEditCustomer,
  } = props;

  const columnHelper = createColumnHelper<Customer>();

  const columns = [
    columnHelper.display({
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{customer.customerName}</span>

            <span className="text-sm text-muted-foreground">
              {customer.contactEmail}
            </span>

            <span className="text-sm text-muted-foreground">
              {customer.contactNumber}
            </span>
          </div>
        );
      },
    }),

    columnHelper.accessor("customerCode", {
      header: "Code",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),

    columnHelper.accessor("address", {
      header: "Address",
      cell: (info) => (
        <span className="text-sm text-muted-foreground">{info.getValue()}</span>
      ),
    }),

    columnHelper.accessor("city", {
      header: "City",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <StatusBadge
          label={formatEnum(info.getValue())}
          variant={customerStatusVariant[info.getValue()]}
        />
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const customer = row.row.original;
        return (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <EditCustomerDialog
              handleEditCustomer={handleEditCustomer}
              customer={customer}
            />
            <Button
              variant={"destructive"}
              onClick={() => props.handleDeleteCustomer(customer.customerId)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={customers}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
        page={page}
        size={size}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </div>
  );
}

export default CustomerTable;
