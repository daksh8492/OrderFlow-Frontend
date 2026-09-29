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
import { EllipsisVertical, Trash2, MapPin, Phone } from "lucide-react";
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
        const initials = customer.customerName
          ?.trim()
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() ?? "")
          .join("") || "?";

        return (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-foreground">
                {customer.customerName}
              </span>
              <span className="text-xs text-muted-foreground">
                {customer.contactEmail}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("customerCode", {
      header: "Code",
      cell: (info) => (
        <span className="font-mono text-xs font-medium bg-muted px-2 py-0.5 rounded">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.display({
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>
              {[customer.city, customer.address].filter(Boolean).join(", ") || "—"}
            </span>
          </div>
        );
      },
    }),

    columnHelper.accessor("contactNumber", {
      header: "Phone",
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3 w-3 shrink-0" />
          <span>{info.getValue() || "—"}</span>
        </div>
      ),
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
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <EditCustomerDialog
              handleEditCustomer={handleEditCustomer}
              customer={customer}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => props.handleDeleteCustomer(customer.customerId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  return (
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
  );
}

export default CustomerTable;
