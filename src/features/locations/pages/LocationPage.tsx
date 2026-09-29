import { getWarehouses } from "@/features/warehouses/api/warehouseApi";
import type { Warehouse } from "@/features/warehouses/types/warehouse";
import { useEffect, useState } from "react";
import LocationTree from "@/features/locations/components/LocationTree";
import { Network, Loader2 } from "lucide-react";

function LocationPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouses(0, 100);
      setWarehouses(response.content);
    } catch (error) {
      console.error("Failed to load warehouses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Card Header */}
        <div className="border-b border-border/50 bg-muted/20 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Network className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-[15px]">Location Hierarchy</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Expand a warehouse to manage zones, aisles, racks, and bins.
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 bg-background/30 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary/40" />
              <p className="text-sm font-medium">Loading location tree...</p>
            </div>
          ) : warehouses.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Network className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">No warehouses available to show locations.</p>
            </div>
          ) : (
            <LocationTree warehouses={warehouses} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationPage;
