import { createColumnHelper } from "@tanstack/react-table";
import type { ItemSummary } from "../types/item";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import ProductCell from "./ProductCell";
import { itemStatusVariant } from "../utils/itemStatusVariant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2Icon } from "lucide-react";
import EditItemStatusDialog from "./EditItemStatusDialog";
import { useState } from "react";
import EditItemDialog from "./EditItemDialog";
import type { ItemFormData } from "../schema/itemSchema";
import DataTable from "@/components/common/DataTable";

function ItemsTable(props: {
  items: ItemSummary[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  handleDelete: (id: string) => void;
  handleDeactivateItem: (id: string) => void;
  handleActivateItem: (id: string) => void;
  handleDiscontinueItem: (id: string) => void;
  handleEditItem: (id:string, data: ItemFormData) => void
  onRowClick: (item: ItemSummary) => void
}) {
  const {
    items,
    page,
    size,
    totalElements,
    totalPages,
    onPageChange,
    onSizeChange,
    handleDelete,
    handleActivateItem,
    handleDeactivateItem,
    handleDiscontinueItem,
    handleEditItem,
    onRowClick
  } = props;

  const [statusDialog, setStatusDialog] = useState(false);

  const columnHelper = createColumnHelper<ItemSummary>();

  const columns = [
    columnHelper.display({
      id: "product",
      header: "Product",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <ProductCell
            image={item.imageUrl}
            name={item.name}
            variants={item.variantCount}
          />
        );
      },
    }),

    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => formatEnum(info.getValue()),
    }),

    columnHelper.accessor("sourceType", {
      header: "Source",
      cell: (info) => formatEnum(info.getValue()),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <StatusBadge
          label={formatEnum(info.getValue())}
          variant={itemStatusVariant[info.getValue()]}
        />
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const item = row.row.original;
        return (
          <div className="flex gap-1" onClick={(e)=>e.stopPropagation()}>
            <EditItemDialog item={item} handleEditItem={handleEditItem} />
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
                  onClick={() => {
                    handleDelete(item.itemId);
                  }}
                >
                  <Trash2Icon /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditItemStatusDialog
              open={statusDialog}
              setOpen={setStatusDialog}
              curStatus={item.status}
              handleActivateItem={() => handleActivateItem(item.itemId)}
              handleDeactivateItem={() => handleDeactivateItem(item.itemId)}
              handleDiscontinueItem={() => handleDiscontinueItem(item.itemId)}
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
        data={items}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
        page={page}
        size={size}
        totalElements={totalElements}
        totalPages={totalPages}
        onRowClick={onRowClick}
      />
    </div>
  );
}

export default ItemsTable;
