import { useEffect, useState } from "react";
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
  updateWarehouseStatus,
} from "../api/warehouseApi";
import type { PageResponse } from "@/types/pageResponse";
import type { Warehouse, WarehouseStatus } from "../types/warehouse";
import WarehousesTable from "../components/WarehousesTable";
import AddWarehouseDialog from "../components/AddWarehouseDialog";
import type { WarehouseFormData } from "../schema/warehouseSchema";
import { toast } from "sonner";

function WarehousesPage() {
  const [warehousePage, setWarehousePage] =
    useState<PageResponse<Warehouse> | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const fetchWarehouses = async () => {
    const response = await getWarehouses(0, 10);
    setWarehousePage(response);
  };

  const handleAddWarehouse = async (data: WarehouseFormData) => {
    try {
      await createWarehouse(data);
      toast.success("Warehouse created successfully");
      await fetchWarehouses();
    } catch (error) {
      toast.error("Failed to create Warehouse");
      console.error("Error creating Warehouse:", error);
    }
  };

  const handleUpdateWarehouse = async (
    data: WarehouseFormData,
    warehouseId: string,
  ) => {
    try {
      await updateWarehouse(data, warehouseId);
      toast.success("Warehouse updated successfully");
      await fetchWarehouses();
    } catch (error) {
      toast.error("Failed to update Warehouse");
      console.error("Error updating Warehouse:", error);
    }
  };

  const handleDeleteWarehouse = async (warehouseId: string) => {
    try {
      await deleteWarehouse(warehouseId);
      toast.success("Warehouse deleted successfully");
      await fetchWarehouses();
    } catch (error) {
      toast.error("Failed to delete Warehouse");
      console.error("Error deleting Warehouse:", error);
    }
  };

  const handleUpdateWarehouseStatus = async (
    warehouseId: string,
    status: WarehouseStatus,
  ) => {
    try {
      await updateWarehouseStatus(warehouseId, status);
      toast.success("Warehouse status updated successfully");
      await fetchWarehouses();
    } catch (error) {
      toast.error("Failed to update Warehouse status");
      console.error("Error updating Warehouse status:", error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [page, size]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
        <p className="text-muted-foreground">Manage Warehouses.</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AddWarehouseDialog handleAddWarehouse={handleAddWarehouse} />
      </div>
      {warehousePage ? (
        <WarehousesTable
          warehouses={warehousePage.content}
          onPageChange={setPage}
          onSizeChange={setSize}
          page={page}
          size={size}
          totalElements={warehousePage.totalElements}
          totalPages={warehousePage.totalPages}
          handleDeleteWarehouse={handleDeleteWarehouse}
          handleUpdateWarehouse={handleUpdateWarehouse}
          handleUpdateWarehouseStatus={handleUpdateWarehouseStatus}
        />
      ) : (
        <p>Warehouse not found</p>
      )}
    </div>
  );
}

export default WarehousesPage;
