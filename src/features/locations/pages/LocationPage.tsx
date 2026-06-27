import { getWarehouses } from "@/features/warehouses/api/warehouseApi";
import type { Warehouse } from "@/features/warehouses/types/warehouse";
import { useEffect, useState } from "react";
import LocationTree from "@/features/locations/components/LocationTree";

function LocationPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const fetchWarehouses = async () => {
    const response = await getWarehouses(0, 100);
    setWarehouses(response.content);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Warehouse Locations</h1>
        <p className="text-muted-foreground">
          Manage warehouse zones, rows, racks and bins.
        </p>
      </div>

      {/* Tree Card */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Warehouse Structure</h2>

          <p className="text-sm text-muted-foreground">
            Expand a warehouse to manage its locations.
          </p>
        </div>

        <div className="p-6">
          <LocationTree warehouses={warehouses} />
        </div>
      </div>
    </div>
  );
}

export default LocationPage;
