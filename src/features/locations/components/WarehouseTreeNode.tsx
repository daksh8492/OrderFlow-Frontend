import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Warehouse } from "../../warehouses/types/warehouse";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, PlusIcon, WarehouseIcon } from "lucide-react";
import { useState } from "react";
import { type Location, type LocationType } from "../types/location";
import {
  activateLocation,
  deactivateLocation,
  deleteLocation,
  getRootLocations,
} from "../api/locationApi";
import LocationTreeNode from "./LocationTreeNode";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { formatEnum } from "@/utils/format";
import { StatusBadge } from "@/components/common/StatusBadge";

function WarehouseTreeNode(props: {
  warehouse: Warehouse;
  addChildLocation: (location: {
    warehouseId: string;
    locationType: LocationType;
    parentLocationId?: string;
  }) => void;
}) {
  const { warehouse, addChildLocation } = props;
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const addNewChildLocation = (location: {
    locationType: LocationType;
    parentLocationId: string;
  }) => {
    addChildLocation({
      warehouseId: warehouse.warehouseId,
      locationType: location.locationType,
      parentLocationId: location.parentLocationId,
    });
  };

  const activateLoc = async (locationId: string) => {
    try {
      await activateLocation(locationId);
      toast.success("Activated the location");
      setOpen(false);
      setLocations(null);
    } catch (error) {
      toast.error("Error in activating location");
      console.error("Error in activating location: ", error);
    }
  };

  const deactivateLoc = async (locationId: string) => {
    try {
      await deactivateLocation(locationId);
      toast.success("Deactivated the location");
      setOpen(false);
      setLocations(null);
    } catch (error) {
      toast.error("Error in deactivating location");
      console.error("Error in deactivating location: ", error);
    }
  };

  const deleteLoc = async (locationId: string) => {
    try {
      await deleteLocation(locationId);
      toast.success("Deleted the location");
      setOpen(false);
      setLocations(null);
    } catch (error) {
      toast.error("Error in deleting location");
      console.error("Error in deleting location: ", error);
    }
  };

  const toggle = async () => {
    if (!open && locations === null) {
      setLoading(true);
      const roots = await getRootLocations(warehouse.warehouseId);
      setLocations(roots);
      setLoading(false);
    }
    setOpen(!open);
  };

  const statusVariant: Record<
    string,
    "primary" | "warning" | "error" | "info" | "neutral"
  > = {
    ACTIVE: "primary",
    INACTIVE: "neutral",
    CLOSED: "error",
  };

  const isClosed = warehouse.status === "CLOSED";
  const isInactive = warehouse.status === "INACTIVE";

  return (
    <Collapsible open={open}>
      <div
        className={`group rounded-xl border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-sm ${
          isClosed || isInactive ? "opacity-60" : ""
        }`}
      >
        <CollapsibleTrigger onClick={toggle} asChild>
          <Button
            variant="ghost"
            disabled={loading}
            className="h-16 w-full justify-start rounded-xl bg-transparent px-4 hover:bg-transparent"
          >
            <ChevronRightIcon
              className={`mr-3 h-4 w-4 shrink-0 transition-transform duration-200 ${
                open ? "rotate-90" : ""
              }`}
            />

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <WarehouseIcon className="h-5 w-5 text-primary" />
            </div>

            <div className="ml-3 flex flex-col items-start">
              <span className="font-semibold">{warehouse.name}</span>
              <span className="text-xs text-muted-foreground">
                {warehouse.code}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <StatusBadge
                label={formatEnum(warehouse.status)}
                variant={statusVariant[warehouse.status] ?? "neutral"}
              />

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => {
                  addChildLocation({
                    locationType: "ZONE",
                    warehouseId: warehouse.warehouseId,
                  });
                  setOpen(false);
                  setLocations(null);
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="ml-6 border-l border-border pl-6 pb-3">
          {loading ? (
            <div className="flex h-12 items-center">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              {locations?.map((location) => (
                <LocationTreeNode
                  key={location.locationId}
                  location={location}
                  addChildLocation={addNewChildLocation}
                  activateLocation={() => activateLoc(location.locationId)}
                  deactivateLocation={() => deactivateLoc(location.locationId)}
                  deleteLocation={() => deleteLoc(location.locationId)}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default WarehouseTreeNode;
