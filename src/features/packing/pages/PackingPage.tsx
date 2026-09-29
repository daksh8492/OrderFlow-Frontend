import { useEffect, useState } from "react";
import { getCartonsByWarehouseId, addCarton, deleteCarton } from "../api/cartonApi";
import type { Carton, AddCartonDto } from "../types/carton";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { PageResponse } from "@/types/pageResponse";
import { toast } from "sonner";
import { Loader2, Package, CheckCircle2, AlertCircle, Plus, Trash2, ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { getOrdersByStatus, getOrderById } from "@/features/orders/apis/orderApi";
import { getPickingByOrderId, type PickingDto } from "@/features/orders/apis/pickingApi";
import { getVariantById } from "@/features/items/api/itemApi";
import type { OrderSummary, Order } from "@/features/orders/types/order";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router";

// Wizard Draft Carton Type
interface DraftCarton {
  weight: number;
  allocations: Record<string, number>; // pickingItemId -> quantity
}

function PackingPage() {
  const user = useAppSelector((state) => state.auth.user);
  
  // Tabs: 'pending' or 'history'
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  // Pending State
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingSize] = useState(20);
  const [pendingOrdersPage, setPendingOrdersPage] = useState<PageResponse<OrderSummary> | null>(null);
  const [loadingPending, setLoadingPending] = useState(false);

  // History State
  const [historyPage, setHistoryPage] = useState(0);
  const [historySize, setHistorySize] = useState(10);
  const [cartonsPage, setCartonsPage] = useState<PageResponse<Carton> | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Wizard State
  const [wizardOrder, setWizardOrder] = useState<Order | null>(null);
  const [wizardPicking, setWizardPicking] = useState<PickingDto | null>(null);
  const [itemNames, setItemNames] = useState<Record<string, string>>({}); // orderItemId -> Name
  const [draftCartons, setDraftCartons] = useState<DraftCarton[]>([{ weight: 0, allocations: {} }]);
  const [activeCartonIndex, setActiveCartonIndex] = useState(0);
  const [loadingWizard, setLoadingWizard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCartons, setGeneratedCartons] = useState<Carton[] | null>(null); // For success screen

  // Fetch Pending Orders
  const fetchPending = async () => {
    setLoadingPending(true);
    try {
      // Get orders that are PICKED
      const response = await getOrdersByStatus("PICKED", pendingPage, pendingSize);
      // Filter to current warehouse on frontend if backend doesn't support it directly
      // Ideally backend filters, but we do this as fallback
      setPendingOrdersPage(response);
    } catch (error) {
      toast.error("Failed to load pending orders");
      console.error(error);
    } finally {
      setLoadingPending(false);
    }
  };

  // Fetch Carton History
  const fetchHistory = async () => {
    if (!user?.warehouseId) return;
    setLoadingHistory(true);
    try {
      const response = await getCartonsByWarehouseId(user.warehouseId, historyPage, historySize);
      setCartonsPage(response);
    } catch (error) {
      toast.error("Failed to load carton history");
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") fetchPending();
  }, [activeTab, pendingPage, pendingSize]);

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
  }, [activeTab, historyPage, historySize, user?.warehouseId]);

  // Handle opening wizard
  const handleStartPacking = async (orderId: string) => {
    setLoadingWizard(true);
    try {
      const fullOrder = await getOrderById(orderId);
      const picking = await getPickingByOrderId(orderId);

      // Fetch variant names based on orderItemId (matching through order items)
      const names: Record<string, string> = {};
      await Promise.all(
        fullOrder.items.map(async (item) => {
          try {
            const variant = await getVariantById(item.variantId);
            names[item.orderItemId] = variant.name;
          } catch (e) {
            names[item.orderItemId] = "Unknown Item";
          }
        })
      );

      setItemNames(names);
      setWizardOrder(fullOrder);
      setWizardPicking(picking);
      setDraftCartons([{ weight: 0, allocations: {} }]);
      setActiveCartonIndex(0);
      setGeneratedCartons(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to load packing data. Is picking completed for this order?";
      toast.error(msg);
    } finally {
      setLoadingWizard(false);
    }
  };

  const handleAllocationChange = (pickingItemId: string, value: string) => {
    const qty = Math.max(0, Number(value) || 0);
    setDraftCartons((prev) => {
      const newDrafts = [...prev];
      newDrafts[activeCartonIndex] = {
        ...newDrafts[activeCartonIndex],
        allocations: {
          ...newDrafts[activeCartonIndex].allocations,
          [pickingItemId]: qty,
        },
      };
      return newDrafts;
    });
  };

  const calculateTotalAllocated = (pickingItemId: string) => {
    return draftCartons.reduce((sum, carton) => sum + (carton.allocations[pickingItemId] || 0), 0);
  };

  const addCartonTab = () => {
    setDraftCartons([...draftCartons, { weight: 0, allocations: {} }]);
    setActiveCartonIndex(draftCartons.length);
  };

  const removeCartonTab = (index: number) => {
    if (draftCartons.length <= 1) return;
    const newDrafts = draftCartons.filter((_, i) => i !== index);
    setDraftCartons(newDrafts);
    setActiveCartonIndex(Math.max(0, index - 1));
  };

  const handleWeightChange = (val: string) => {
    const w = Number(val) || 0;
    setDraftCartons((prev) => {
      const newDrafts = [...prev];
      newDrafts[activeCartonIndex].weight = w;
      return newDrafts;
    });
  };

  const handleCompletePacking = async () => {
    if (!wizardOrder || !wizardPicking || !user?.warehouseId) return;

    // Validation: All items must be fully allocated
    for (const pickItem of wizardPicking.pickingItems) {
      const allocated = calculateTotalAllocated(pickItem.pickingItemId!);
      if (allocated !== pickItem.pickedItems) {
        toast.error(`Item quantity mismatch! You allocated ${allocated} of ${pickItem.pickedItems} for one of the items.`);
        return;
      }
    }

    // Validation: Cartons must have >0 weight and >0 items
    for (let i = 0; i < draftCartons.length; i++) {
      const carton = draftCartons[i];
      const totalItemsInCarton = Object.values(carton.allocations).reduce((sum, q) => sum + q, 0);
      if (totalItemsInCarton === 0) {
        toast.error(`Carton ${i + 1} is empty! Please remove it or add items.`);
        return;
      }
      if (carton.weight <= 0) {
        toast.error(`Carton ${i + 1} must have a valid weight greater than 0.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const successCartons: Carton[] = [];

      // Create each carton
      for (const draft of draftCartons) {
        const cartonItems = Object.entries(draft.allocations)
          .filter(([_, qty]) => qty > 0)
          .map(([pickItemId, qty]) => {
            // Find corresponding orderItemId from pickItemId
            const pItem = wizardPicking.pickingItems.find(p => p.pickingItemId === pickItemId);
            return {
              orderItemId: pItem!.orderItemId,
              packedQuantity: qty,
            };
          });

        const dto: AddCartonDto = {
          orderId: wizardOrder.orderId,
          packerId: user.userId,
          warehouseId: user.warehouseId,
          weight: draft.weight,
          pickingId: wizardPicking.pickingId!,
          cartonItems,
        };

        const res = await addCarton(dto);
        successCartons.push(res);
      }

      setGeneratedCartons(successCartons);
      toast.success("Packing completed successfully!");
      fetchPending(); // Refresh list
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to submit packing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseWizard = () => {
    setWizardOrder(null);
    setWizardPicking(null);
    setGeneratedCartons(null);
  };

  // --- History Table Config ---
  const columnHelper = createColumnHelper<Carton>();
  const columns = [
    columnHelper.accessor("cartonNumber", {
      header: "Carton Number",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{info.getValue() || "N/A"}</span>
        </div>
      ),
    }),
    columnHelper.accessor("weight", {
      header: "Weight (kg)",
      cell: (info) => (
        <span className="font-medium text-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <StatusBadge
          label={info.getValue()}
          variant={info.getValue() === "PACKED" ? "primary" : "neutral"}
        />
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Packed",
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {new Date(info.getValue()).toLocaleString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          onClick={async (e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this carton?")) {
              try {
                await deleteCarton(info.row.original.cartonId!);
                toast.success("Carton deleted successfully");
                fetchHistory();
              } catch (err) {
                toast.error("Failed to delete carton");
              }
            }
          }}
        >
          <Trash2 size={12} className="mr-1" /> Delete
        </Button>
      ),
    }),
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300 p-5">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packing</h1>
          <p className="text-sm text-muted-foreground">
            Pack items from completed picking lists into warehouse cartons.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b gap-6">
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "pending"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Packing
        </button>
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Packed History
        </button>
      </div>

      {/* Pending Tab Content */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {loadingPending ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !pendingOrdersPage || pendingOrdersPage.content.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center p-6 bg-card">
              <Package className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <h3 className="font-semibold text-sm">No Orders to Pack</h3>
              <p className="text-xs text-muted-foreground mt-1">
                There are currently no picked orders waiting to be packed.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y border rounded-lg overflow-hidden bg-card shadow-xs">
                {pendingOrdersPage.content.map((order) => (
                  <div key={order.orderId} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:bg-muted/10 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">{order.orderNumber}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          {order.priority}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Customer: <span className="font-medium text-foreground">{order.receiverName}</span> • Date: {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        className="h-8 text-xs font-semibold gap-1.5"
                        onClick={() => handleStartPacking(order.orderId)}
                        disabled={loadingWizard}
                      >
                        {loadingWizard ? <Loader2 size={13} className="animate-spin" /> : <Package size={13} />}
                        Start Packing
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Basic Pagination for pending */}
              <div className="flex items-center justify-between border-t bg-card px-6 py-4 rounded-lg border shadow-xs">
                 <div className="flex items-center gap-4 text-xs text-muted-foreground">
                   <span>{pendingOrdersPage.totalElements} pending</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPendingPage(Math.max(0, pendingPage - 1))} disabled={pendingPage === 0}>
                      <ArrowLeft size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPendingPage(Math.min(pendingOrdersPage.totalPages - 1, pendingPage + 1))} disabled={pendingPage >= pendingOrdersPage.totalPages - 1}>
                      <ArrowRight size={14} />
                    </Button>
                 </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* History Tab Content */}
      {activeTab === "history" && (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          {loadingHistory ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cartonsPage?.content?.length ? (
            <DataTable
              columns={columns}
              data={cartonsPage.content}
              onPageChange={setHistoryPage}
              onSizeChange={setHistorySize}
              page={historyPage}
              size={historySize}
              totalElements={cartonsPage.totalElements}
              totalPages={cartonsPage.totalPages}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground flex-col gap-2">
              <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
              <p>No cartons packed yet.</p>
            </div>
          )}
        </div>
      )}

      {/* PACKING WIZARD MODAL */}
      <Dialog open={!!wizardOrder} onOpenChange={(open) => !open && !isSubmitting && handleCloseWizard()}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0">
          
          <DialogHeader className="border-b px-8 py-5 sticky top-0 bg-background z-10">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Package className="text-primary h-5 w-5" />
              {generatedCartons ? "Packing Complete!" : `Packing Wizard: ${wizardOrder?.orderNumber}`}
            </DialogTitle>
            {!generatedCartons && (
              <p className="text-sm text-muted-foreground mt-1">
                Allocate picked items into one or more cartons. Adhere to weight and size constraints.
              </p>
            )}
          </DialogHeader>

          <div className="px-8 py-6">
            {generatedCartons ? (
              <div className="space-y-6 text-center py-8 animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold">Successfully Packed!</h3>
                <p className="text-muted-foreground">The order has been packed into {generatedCartons.length} carton(s).</p>
                
                <div className="max-w-md mx-auto grid gap-3 mt-6">
                  {generatedCartons.map((c, i) => (
                    <div key={c.cartonId} className="flex justify-between items-center p-4 border rounded-xl bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Package className="text-muted-foreground" size={20} />
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground uppercase font-bold">Carton {i + 1}</p>
                          <p className="font-mono font-bold">{c.cartonNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-muted-foreground">Weight</p>
                         <p className="font-bold">{c.weight} kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : wizardPicking ? (
              <div className="space-y-6">
                {/* Carton Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
                  {draftCartons.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCartonIndex(i)}
                      className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeCartonIndex === i
                          ? "border-primary text-primary bg-primary/5"
                          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <Package size={16} />
                      Carton {i + 1}
                      {draftCartons.length > 1 && activeCartonIndex === i && (
                        <Trash2 
                          size={14} 
                          className="ml-2 text-rose-500 hover:text-rose-700 cursor-pointer" 
                          onClick={(e) => { e.stopPropagation(); removeCartonTab(i); }}
                        />
                      )}
                    </button>
                  ))}
                  <button
                    onClick={addCartonTab}
                    className="px-3 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Carton
                  </button>
                </div>

                {/* Active Carton Form */}
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border">
                    <div className="w-1/3">
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Carton Weight (kg)</label>
                      <Input 
                        type="number" 
                        min={0}
                        step={0.1}
                        value={draftCartons[activeCartonIndex].weight || ""} 
                        onChange={(e) => handleWeightChange(e.target.value)}
                        placeholder="e.g. 5.5"
                        className="font-mono"
                      />
                    </div>
                    <div className="w-2/3 text-sm text-muted-foreground">
                      Enter the total weighed mass for Carton {activeCartonIndex + 1} after allocating items below.
                    </div>
                  </div>

                  {/* Picked Items Allocation */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold border-b pb-2">Allocate Picked Items</h4>
                    <div className="grid gap-4">
                      {wizardPicking.pickingItems.map((pickItem) => {
                        const name = itemNames[pickItem.orderItemId] || "Loading...";
                        const totalAllocated = calculateTotalAllocated(pickItem.pickingItemId!);
                        const remaining = pickItem.pickedItems - totalAllocated;
                        const currentCartonAlloc = draftCartons[activeCartonIndex].allocations[pickItem.pickingItemId!] || 0;
                        const isFullyAllocated = totalAllocated === pickItem.pickedItems;

                        return (
                          <div key={pickItem.pickingItemId} className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${isFullyAllocated ? 'bg-emerald-50/30 border-emerald-100' : 'bg-background hover:border-primary/30'}`}>
                            <div className="space-y-1 w-1/2">
                              <p className="font-bold text-foreground">{name}</p>
                              <p className="text-xs text-muted-foreground font-mono">Total Picked: {pickItem.pickedItems}</p>
                            </div>

                            <div className="flex items-center gap-6 w-1/2 justify-end">
                               {isFullyAllocated ? (
                                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Packed
                                  </span>
                               ) : (
                                  <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <AlertCircle size={12} /> {remaining} left to pack
                                  </span>
                               )}
                               
                               <div className="flex flex-col gap-1 items-end">
                                 <label className="text-[10px] uppercase font-bold text-muted-foreground">In this carton</label>
                                 <Input 
                                    type="number"
                                    min={0}
                                    max={remaining + currentCartonAlloc}
                                    value={currentCartonAlloc || ""}
                                    onChange={(e) => handleAllocationChange(pickItem.pickingItemId!, e.target.value)}
                                    className="w-20 text-center font-bold"
                                    placeholder="0"
                                 />
                               </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="border-t px-8 py-4 sticky bottom-0 bg-background z-10 gap-2">
            {!generatedCartons ? (
              <>
                <Button variant="outline" onClick={handleCloseWizard} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleCompletePacking} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Complete Packing"}
                </Button>
              </>
            ) : (
              <Button onClick={handleCloseWizard}>
                Close
              </Button>
            )}
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PackingPage;
