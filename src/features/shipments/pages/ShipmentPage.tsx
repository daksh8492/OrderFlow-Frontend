import { useEffect, useState, useMemo } from "react";
import { getAllShipments, addShipment, dispatchShipment, deliverShipment, addCartonToShipment, deleteShipment } from "../api/shipmentApi";
import type { Shipment, AddShipmentDto } from "../types/shipment";
import { getCartonsByWarehouseId } from "@/features/packing/api/cartonApi";
import type { Carton } from "@/features/packing/types/carton";
import { getOrderById } from "@/features/orders/apis/orderApi";
import type { Order } from "@/features/orders/types/order";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { PageResponse } from "@/types/pageResponse";
import { toast } from "sonner";
import { Loader2, Truck, Box, Plus, Navigation, CheckCircle2, Search, ClipboardList, Trash2, PackagePlus } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function ShipmentPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"docking" | "history">("docking");

  // Shipments State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [shipmentsPage, setShipmentsPage] = useState<PageResponse<Shipment> | null>(null);
  const [loading, setLoading] = useState(false);

  // Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardLoading, setWizardLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [availableCartons, setAvailableCartons] = useState<Carton[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, Order>>({});
  
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  
  // Add Carton to Existing Shipment State
  const [addCartonTargetId, setAddCartonTargetId] = useState<string | null>(null);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await getAllShipments(page, size);
      setShipmentsPage(response);
    } catch (error) {
      toast.error("Failed to load shipments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [page, size, activeTab]);

  // Derived filtered shipments based on tabs
  // (In a real app, backend should filter by status, but we do it frontend for now based on the page)
  const filteredShipments = useMemo(() => {
    if (!shipmentsPage?.content) return [];
    if (activeTab === "docking") {
      return shipmentsPage.content.filter((s) => s.status === "DOCKING");
    }
    return shipmentsPage.content.filter((s) => s.status !== "DOCKING");
  }, [shipmentsPage, activeTab]);

  // WIZARD LOGIC
  const openWizard = async () => {
    if (!user?.warehouseId) return;
    setWizardOpen(true);
    setWizardLoading(true);
    setSelectedOrderIds(new Set());
    setTrackingNumber("");
    try {
      // Fetch available cartons (status === PACKED) for the current warehouse
      const cartonsRes = await getCartonsByWarehouseId(user.warehouseId, 0, 100);
      const packedCartons = (cartonsRes.content || []).filter((c) => c.status === "PACKED");
      setAvailableCartons(packedCartons);

      // Fetch order details to display order number/customer in UI
      const uniqueOrderIds = Array.from(new Set(packedCartons.map((c) => c.orderId)));
      const ordersMap: Record<string, Order> = {};
      await Promise.all(
        uniqueOrderIds.map(async (oid) => {
          try {
            const ord = await getOrderById(oid);
            ordersMap[oid] = ord;
          } catch (e) {
            console.error("Failed to fetch order", oid);
          }
        })
      );
      setOrderDetails(ordersMap);
    } catch (error) {
      toast.error("Failed to load available cartons");
      console.error(error);
    } finally {
      setWizardLoading(false);
    }
  };

  // Group cartons by Order ID for the UI
  const groupedCartons = useMemo(() => {
    const groups: Record<string, Carton[]> = {};
    availableCartons.forEach((c) => {
      if (!groups[c.orderId]) groups[c.orderId] = [];
      groups[c.orderId].push(c);
    });
    return groups;
  }, [availableCartons]);

  const toggleOrderSelection = (orderId: string) => {
    const newSet = new Set(selectedOrderIds);
    if (newSet.has(orderId)) newSet.delete(orderId);
    else newSet.add(orderId);
    setSelectedOrderIds(newSet);
  };

  const handleCreateShipment = async () => {
    if (selectedOrderIds.size === 0) {
      toast.error("Please select at least one order to ship.");
      return;
    }
    if (!user?.warehouseId || !user?.userId) return;

    // Collect ALL carton IDs from the selected orders to satisfy the validation rule
    const cartonIdsToShip: string[] = [];
    selectedOrderIds.forEach((oid) => {
      const cartons = groupedCartons[oid] || [];
      cartons.forEach((c) => cartonIdsToShip.push(c.cartonId));
    });

    setIsSubmitting(true);
    try {
      // 1. Create Empty Shipment
      const dto: AddShipmentDto = {
        warehouseId: user.warehouseId,
        shipperId: user.userId,
        trackingNumber: trackingNumber || undefined,
      };
      const createdShipment = await addShipment(dto);

      // 2. Add each carton to the shipment individually sequentially to prevent database locking issues
      for (const cartonId of cartonIdsToShip) {
        await addCartonToShipment(createdShipment.shipmentId, cartonId);
      }

      toast.success("Shipment created successfully!");
      setWizardOpen(false);
      fetchShipments(); // Refresh list
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create shipment");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCartonToExisting = async () => {
    if (!addCartonTargetId || selectedOrderIds.size === 0) {
      toast.error("Please select at least one order to add.");
      return;
    }

    const cartonIdsToShip: string[] = [];
    selectedOrderIds.forEach((oid) => {
      const cartons = groupedCartons[oid] || [];
      cartons.forEach((c) => cartonIdsToShip.push(c.cartonId));
    });

    setIsSubmitting(true);
    try {
      for (const cartonId of cartonIdsToShip) {
        await addCartonToShipment(addCartonTargetId, cartonId);
      }
      toast.success("Cartons added to shipment successfully!");
      setAddCartonTargetId(null);
      fetchShipments();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to add cartons to shipment");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ACTION LOGIC
  const handleDispatch = async (id: string) => {
    try {
      await dispatchShipment(id);
      toast.success("Shipment dispatched!");
      fetchShipments();
    } catch (e) {
      toast.error("Failed to dispatch shipment");
    }
  };

  const handleDeliver = async (id: string) => {
    try {
      await deliverShipment(id);
      toast.success("Shipment marked as delivered!");
      fetchShipments();
    } catch (e) {
      toast.error("Failed to deliver shipment");
    }
  };

  // TABLE COLUMNS
  const columnHelper = createColumnHelper<Shipment>();
  const columns = [
    columnHelper.accessor("shipmentNumber", {
      header: "Shipment #",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-bold text-foreground">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("cartonIds", {
      header: "Cartons",
      cell: (info) => (
        <span className="text-sm font-medium">
          {info.getValue()?.length || 0} box(es)
        </span>
      ),
    }),
    columnHelper.accessor("trackingNumber", {
      header: "Tracking Number",
      cell: (info) => (
        <span className="text-sm font-mono text-muted-foreground">
          {info.getValue() || "N/A"}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();
        return (
          <StatusBadge
            label={val}
            variant={val === "DELIVERED" ? "info" : val === "IN_TRANSIT" ? "warning" : "primary"}
          />
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const s = info.row.original;
        if (s.status === "DOCKING") {
          return (
            <div className="flex items-center gap-1.5">
              <Button size="sm" onClick={() => handleDispatch(s.shipmentId)} className="h-7 text-xs">
                <Navigation size={12} className="mr-1" /> Dispatch
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={async () => {
                  setAddCartonTargetId(s.shipmentId);
                  await openWizard(); // Reuse the same loading logic
                }} 
                className="h-7 text-xs px-2.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <PackagePlus size={12} className="mr-1" /> Add
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this shipment?")) {
                    try {
                      await deleteShipment(s.shipmentId);
                      toast.success("Shipment deleted");
                      fetchShipments();
                    } catch (e) {
                      toast.error("Failed to delete shipment");
                    }
                  }
                }} 
                className="h-7 text-xs px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={12} className="mr-1" /> Delete
              </Button>
            </div>
          );
        }
        if (s.status === "IN_TRANSIT") {
          return (
            <Button size="sm" variant="outline" onClick={() => handleDeliver(s.shipmentId)} className="h-7 text-xs border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
              <CheckCircle2 size={12} className="mr-1" /> Mark Delivered
            </Button>
          );
        }
        return <span className="text-xs text-muted-foreground italic">Completed</span>;
      },
    }),
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300 p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-sm text-muted-foreground">
            Group cartons and manage outbound logistics.
          </p>
        </div>
        <Button onClick={openWizard}>
          <Plus className="h-4 w-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-6">
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "docking"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("docking")}
        >
          Docking (Pending)
        </button>
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("history")}
        >
          In-Transit / Delivered
        </button>
      </div>

      {/* Table Content */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredShipments.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredShipments}
            onPageChange={setPage}
            onSizeChange={setSize}
            page={page}
            size={size}
            totalElements={shipmentsPage?.totalElements || 0}
            totalPages={shipmentsPage?.totalPages || 1}
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground flex-col gap-2">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
            <p>No shipments found in this category.</p>
          </div>
        )}
      </div>

      {/* CREATE / ADD CARTON WIZARD */}
      <Dialog 
        open={wizardOpen || !!addCartonTargetId} 
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setWizardOpen(false);
            setAddCartonTargetId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl lg:max-w-4xl p-0 gap-0 max-h-[85vh] flex flex-col">
          <DialogHeader className="px-6 py-4 border-b bg-muted/20">
            <DialogTitle className="flex items-center gap-2">
              {addCartonTargetId ? <PackagePlus className="h-5 w-5 text-primary" /> : <Truck className="h-5 w-5 text-primary" />}
              {addCartonTargetId ? "Add Cartons to Shipment" : "Create New Shipment"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Select entire orders to ship. All cartons belonging to a selected order will be grouped into this shipment.
            </p>
          </DialogHeader>

          <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-background">
            {wizardLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : Object.keys(groupedCartons).length === 0 ? (
              <div className="flex flex-col h-40 items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <Box className="h-8 w-8 mb-2 text-muted-foreground/50" />
                <p className="text-sm font-semibold">No packed cartons available.</p>
                <p className="text-xs">Go pack some orders first!</p>
              </div>
            ) : (
              <>
                {!addCartonTargetId && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground block">Optional Tracking Number</label>
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Enter AWL or Tracking ID..." 
                        className="pl-9 font-mono"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-bold border-b pb-2">Available Orders to Ship</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(groupedCartons).map(([orderId, cartons]) => {
                      const isSelected = selectedOrderIds.has(orderId);
                      const ord = orderDetails[orderId];
                      const totalWeight = cartons.reduce((sum, c) => sum + c.weight, 0);

                      return (
                        <div 
                          key={orderId} 
                          onClick={() => toggleOrderSelection(orderId)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-muted hover:border-primary/40 bg-card"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="space-y-0.5">
                              <p className="font-bold text-foreground font-mono">
                                {ord?.orderNumber || "Loading..."}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {ord?.receiverName || "Unknown Customer"}
                              </p>
                            </div>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 text-transparent'}`}>
                              <CheckCircle2 size={12} />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs mt-3 bg-background p-2 rounded-lg border">
                             <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                               <Box size={14} /> {cartons.length} Box(es)
                             </div>
                             <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                               <span className="font-bold">{totalWeight.toFixed(1)}kg</span> Total
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-muted/20">
            <Button variant="outline" onClick={() => { setWizardOpen(false); setAddCartonTargetId(null); }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={addCartonTargetId ? handleAddCartonToExisting : handleCreateShipment} disabled={isSubmitting || selectedOrderIds.size === 0}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : addCartonTargetId ? <PackagePlus className="h-4 w-4 mr-2" /> : <Truck className="h-4 w-4 mr-2" />}
              {addCartonTargetId ? "Add Cartons" : "Create Shipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShipmentPage;
