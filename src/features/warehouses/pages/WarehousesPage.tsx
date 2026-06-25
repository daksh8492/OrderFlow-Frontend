import { useEffect, useState } from "react";
import { getWarehouses } from "../api/warehouseApi";
import type { PageResponse } from "@/types/pageResponse";
import type { Warehouse } from "../types/warehouse";

function WarehousesPage() {
  const [warehousePage, setWarehousePage] = useState<PageResponse<Warehouse> | null>(
    null,
  );

  const fetchWarehouses = async () => {
    const response = await getWarehouses(0, 10);
    setWarehousePage(response);
    console.log(response);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
        <p className="text-muted-foreground">Manage Warehouses.</p>
      </div>
    </div>
  );
}

export default WarehousesPage;
