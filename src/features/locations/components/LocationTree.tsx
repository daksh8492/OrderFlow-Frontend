import type { Warehouse } from "../../warehouses/types/warehouse";
import WarehouseTreeNode from "./WarehouseTreeNode";
import { addLocation } from "../api/locationApi";
import type { LocationType } from "../types/location";
import { toast } from "sonner";

function LocationTree({ warehouses }: { warehouses: Warehouse[] }) {
  const addChildLocation = async (location: {
    warehouseId: string;
    locationType: LocationType;
    parentLocationId?: string;
  }) => {
    try {
      await addLocation(location);
      console.log("ADDED Location");
      toast.success("New location added successfully");
    } catch (error) {
      console.error("ERROR ADDING LOCATION: ", error);
      toast.error("Error addin in new location");
    }
  };

  return (
    <div className="space-y-4">
      {warehouses.map((warehouse) => (
        <WarehouseTreeNode key={warehouse.warehouseId} warehouse={warehouse} addChildLocation={addChildLocation} />
      ))}
    </div>
  );
}

export default LocationTree;
