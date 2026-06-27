import type { Location, LocationType } from "../types/location";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Archive,
  Building2,
  ChevronRightIcon,
  Package,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Rows3,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { getChildLocations } from "../api/locationApi";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

const NEXT_TYPE_LABEL: Record<LocationType, string | null> = {
  ZONE: "Add Row",
  ROW: "Add Rack",
  RACK: "Add Bin",
  BIN: null,
};

const CHILD_TYPE: Record<LocationType, LocationType> = {
  ZONE: "ROW",
  ROW: "RACK",
  RACK: "BIN",
  BIN: "BIN",
};

const locationIcons = {
  ZONE: Building2,
  ROW: Rows3,
  RACK: Archive,
  BIN: Package,
};

function LocationTreeNode(props: {
  location: Location;
  addChildLocation: (location: {
    locationType: LocationType;
    parentLocationId: string;
  }) => void;
  activateLocation: () => void;
  deactivateLocation: () => void;
  deleteLocation: () => void;
}) {
  const {
    location,
    addChildLocation,
    activateLocation,
    deactivateLocation,
    deleteLocation,
  } = props;
  const [children, setChildren] = useState<Location[] | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const Icon = locationIcons[location.locationType];

  const toggle = async () => {
    if (!open && children === null) {
      setLoading(true);
      const locations = await getChildLocations(location.locationId);
      setChildren(locations);
      setLoading(false);
    }
    setOpen(!open);
  };

  const isLeaf = location.locationType === "BIN";
  const isDimmed = location.active === false;
  const addLabel = NEXT_TYPE_LABEL[location.locationType];

  if (isLeaf) {
    return (
      <div
        className={`flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-all hover:border-primary/30 ${
          isDimmed ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">
              {location.locationName ?? location.code}
            </span>

            <span className="text-xs text-muted-foreground">
              BIN • {location.code}
            </span>
          </div>
        </div>

        <Badge variant={location.active ? "default" : "secondary"}>
          {location.active ? "Active" : "Inactive"}
        </Badge>
      </div>
    );
  }

  return (
    <Collapsible open={open}>
      <div
        className={`group rounded-lg border bg-card transition-all duration-200 hover:border-primary/30 ${
          isDimmed ? "opacity-60" : ""
        }`}
      >
        <CollapsibleTrigger onClick={toggle} asChild>
          <Button
            variant="ghost"
            disabled={loading}
            className="h-14 w-full justify-start rounded-lg bg-transparent px-3 hover:bg-transparent"
          >
            <ChevronRightIcon
              className={`mr-3 h-4 w-4 shrink-0 transition-transform duration-200 ${
                open ? "rotate-90" : ""
              }`}
            />

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
              <Icon className="h-4 w-4 text-primary" />
            </div>

            <div className="ml-3 flex flex-col items-start">
              <span className="font-medium">
                {location.locationName ?? location.code}
              </span>

              <span className="text-xs text-muted-foreground">
                {location.locationType} • {location.code}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Badge variant={location.active ? "default" : "secondary"}>
                {location.active ? "Active" : "Inactive"}
              </Badge>

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {addLabel && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      addChildLocation({
                        locationType: CHILD_TYPE[location.locationType],
                        parentLocationId: location.locationId,
                      });
                      setOpen(false);
                      setChildren(null);
                    }}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                )}

                {location.active ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      deactivateLocation();
                    }}
                  >
                    <PauseIcon className="size-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      activateLocation();
                    }}
                  >
                    <PlayIcon className="size-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => deleteLocation()}
                >
                  <Trash className="text-primary"/>
                </Button>
              </div>
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="ml-5 border-l border-border pl-5 pb-2">
          {loading ? (
            <div className="flex h-10 items-center">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              {children?.map((child) => (
                <LocationTreeNode
                  key={child.locationId}
                  location={child}
                  addChildLocation={addChildLocation}
                  activateLocation={activateLocation}
                  deactivateLocation={deactivateLocation}
                  deleteLocation={deleteLocation}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default LocationTreeNode;
