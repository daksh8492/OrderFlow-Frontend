import { createColumnHelper } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import type { Vendor, VendorStatus } from "../types/vendor";
import DataTable from "@/components/common/DataTable";
import EditVendorDialog from "./EditVendorDialog";
import type { VendorFormData } from "../schema/vendorSchema";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  handleDeleteVendor: (vendorid: string) => void
}) {

    const {onPageChange, onSizeChange, page, size, totalElements, totalPages, vendors, handleEditVendor, handleDeleteVendor} = props;

    const columns = [
  columnHelper.display({
    id: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const vendor = row.original;

      return (<div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <span className="font-medium">{vendor.vendorName}</span>

          <span className="text-sm text-muted-foreground">
            {vendor.contactEmail}
          </span>

          <span className="text-sm text-muted-foreground">
            {vendor.contactNumber}
          </span>
        </div>
        <Separator orientation="vertical"  />
        <span className="text-muted-foreground"> {vendor.currency}</span>
        </div>
      );
    },
  }),

  columnHelper.accessor("vendorCode", {
    header: "Code",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),

  columnHelper.accessor("vendorBrand", {
    header: "Brand",
    cell: (info) => (
      <span className="text-muted-foreground">{info.getValue() || "-"}</span>
    ),
  }),

  columnHelper.accessor("city", {
    header: "City",
    cell: (info) => info.getValue() || "-",
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
    cell: ({row}) => {
      const vendor = row.original;
      return (<div className="flex gap-1" onClick={(e)=>e.stopPropagation()}>
            <EditVendorDialog vendor={vendor} handleEditVendor={handleEditVendor} />
            <Button
              variant={"destructive"}
              onClick={() => props.handleDeleteVendor(vendor.vendorId)}
            >
              <Trash2 />
            </Button>
          </div>)
    }
  })
];

  return <div>
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
    </div>;
}

export default VendorTable;
