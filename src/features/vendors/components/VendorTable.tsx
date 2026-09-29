import { createColumnHelper } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import type { Vendor, VendorStatus } from "../types/vendor";
import DataTable from "@/components/common/DataTable";
import EditVendorDialog from "./EditVendorDialog";
import type { VendorFormData } from "../schema/vendorSchema";
import { Button } from "@/components/ui/button";
import { Trash2, EllipsisVertical, MapPin, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columnHelper = createColumnHelper<Vendor>();

const vendorStatusVariant: Record<
  VendorStatus,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  ACTIVE: "primary",
  INACTIVE: "neutral",
  CLOSED: "error",
};

function VendorTable(props: {
  vendors: Vendor[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  handleEditVendor: (vendorId: string, data: VendorFormData) => void;
  handleDeleteVendor: (vendorid: string) => void;
}) {
  const {
    onPageChange,
    onSizeChange,
    page,
    size,
    totalElements,
    totalPages,
    vendors,
    handleEditVendor,
  } = props;

  const columns = [
    columnHelper.display({
      id: "vendor",
      header: "Vendor",
      cell: ({ row }) => {
        const vendor = row.original;
        const initials = vendor.vendorName
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
                {vendor.vendorName}
              </span>
              <span className="text-xs text-muted-foreground">
                {vendor.contactEmail}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("vendorCode", {
      header: "Code",
      cell: (info) => (
        <span className="font-mono text-xs font-medium bg-muted px-2 py-0.5 rounded">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("vendorBrand", {
      header: "Brand",
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.getValue() || "—"}
        </span>
      ),
    }),

    columnHelper.display({
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{vendor.city || "—"}</span>
          </div>
        );
      },
    }),

    columnHelper.accessor("currency", {
      header: "Currency",
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Globe className="h-3 w-3 shrink-0" />
          <span className="font-medium text-foreground">{info.getValue() || "—"}</span>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <StatusBadge
          label={formatEnum(info.getValue())}
          variant={vendorStatusVariant[info.getValue()]}
        />
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <EditVendorDialog vendor={vendor} handleEditVendor={handleEditVendor} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => props.handleDeleteVendor(vendor.vendorId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete vendor
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
      data={vendors}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      page={page}
      size={size}
      totalElements={totalElements}
      totalPages={totalPages}
    />
  );
}

export default VendorTable;
