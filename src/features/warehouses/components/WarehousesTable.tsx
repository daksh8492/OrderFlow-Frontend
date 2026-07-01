import { createColumnHelper } from "@tanstack/react-table";
import type { Warehouse, WarehouseStatus } from "../types/warehouse";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2Icon } from "lucide-react";
import EditWarehouseDialog from "./EditWarehouseDialog";
import type { WarehouseFormData } from "../schema/warehouseSchema";
import { useState } from "react";
import EditWarehouseStatusDialog from "./EditWarehouseStatusDialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import DataTable from "@/components/common/DataTable";

const statusVariant: Record<
  string,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  ACTIVE: "primary",
  INACTIVE: "neutral",
  CLOSED: "error",
};

function WarehousesTable(props: {
  warehouses: Warehouse[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  handleDeleteWarehouse: (warehouseId: string) => void;
  handleUpdateWarehouse: (data: WarehouseFormData, warhouseid: string) => void;
  handleUpdateWarehouseStatus: (
    warehouseId: string,
    status: WarehouseStatus,
  ) => void;
}) {
  const {
    warehouses,
    page,
    size,
    totalPages,
    totalElements,
    onPageChange,
    onSizeChange,
    handleDeleteWarehouse,
    handleUpdateWarehouse,
    handleUpdateWarehouseStatus,
  } = props;

  const [statusDialog, setStatusDialog] = useState(false);

  const columnsHelper = createColumnHelper<Warehouse>();

  const columns = [
    columnsHelper.accessor("code", {
      header: "Code",
      cell: (info) => info.getValue(),
    }),
    columnsHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnsHelper.accessor("city", {
      header: "City",
      cell: (info) => info.getValue(),
    }),
    columnsHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <StatusBadge
          label={formatEnum(info.getValue())}
          variant={statusVariant[info.getValue()] ?? "neutral"}
        />
      ),
    }),
    columnsHelper.accessor("locationIds", {
      header: "Locations",
      cell: (info) => info.getValue().length,
    }),
    columnsHelper.display({
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const warehouse = row.row.original;
        return (
          <div className="flex gap-1">
            <EditWarehouseDialog
              onSubmit={handleUpdateWarehouse}
              warehouse={warehouse}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusDialog(true)}>
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDeleteWarehouse(warehouse.warehouseId)}
                >
                  <Trash2Icon /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditWarehouseStatusDialog
              open={statusDialog}
              setOpen={setStatusDialog}
              curStatus={warehouse.status}
              handleUpdateWarehouseStatus={(status: WarehouseStatus) => {
                handleUpdateWarehouseStatus(warehouse.warehouseId, status);
              }}
            />
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={warehouses}
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

export default WarehousesTable;
