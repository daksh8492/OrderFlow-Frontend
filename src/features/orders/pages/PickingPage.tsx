import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ClipboardList, ExternalLink, Package, Loader2, ArrowLeft, ArrowRight, MoveLeft, MoveRight, CheckCircle2, ChevronRight, AlertCircle, Sparkles } from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { type Order, type OrderSummary, type OrderItem } from "../types/order";
import { getPickableOrders, getOrderById } from "../apis/orderApi";
import { createPicking, getPickingsByWarehouse, getPickingById, deletePicking, type PickingSummaryDto } from "../apis/pickingApi";
import { getWarehouseStocksByVariant, type WarehouseStock } from "@/features/warehouse-stock/api/warehouseStockApi";
import { getVariantById } from "@/features/items/api/itemApi";
import { getLocationById } from "@/features/locations/api/locationApi";
import { type Variant } from "@/features/items/types/item";
import { type PageResponse } from "@/types/pageResponse";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function PickingPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [ordersPage, setOrdersPage] = useState<PageResponse<OrderSummary>>();
  const [loading, setLoading] = useState(true);

  // Picking Wizard State
  const [pickingOrder, setPickingOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderItemsDetails, setOrderItemsDetails] = useState<Record<string, { variant: Variant; stocks: WarehouseStock[] }>>({});
  const [stockLocationNames, setStockLocationNames] = useState<Record<string, string>>({}); // stockId -> location name
  const [pickingAllocations, setPickingAllocations] = useState<Record<string, Record<string, number>>>({}); // orderItemId -> stockId -> qty
  const [isSubmittingPicking, setIsSubmittingPicking] = useState(false);

  // Tab State & History
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [historyPage, setHistoryPage] = useState(0);
  const [historySize, setHistorySize] = useState(20);
  const [historyData, setHistoryData] = useState<PageResponse<PickingSummaryDto>>();
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchOrdersToPick = async () => {
    try {
      setLoading(true);
      // Fetch orders pickable for the logged-in user's warehouse
      const res = await getPickableOrders(page, size);
      setOrdersPage(res);
    } catch (err) {
      toast.error("Failed to load orders for picking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersToPick();
  }, [page, size]);

  const fetchPickingHistory = async () => {
    if (!user?.warehouseId) return;
    try {
      setLoadingHistory(true);
      const res = await getPickingsByWarehouse(user.warehouseId, historyPage, historySize);
      setHistoryData(res);
    } catch (err) {
      toast.error("Failed to load picking history");
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchPickingHistory();
    }
  }, [activeTab, historyPage, historySize, user?.warehouseId]);

  // Get orders directly from backend response page
  const ordersToPick = ordersPage?.content || [];

  const handleStartPicking = async (orderId: string) => {
    setLoadingOrder(true);
    try {
      const fullOrder = await getOrderById(orderId);
      
      // Load details for each item
      const detailsMap: Record<string, { variant: Variant; stocks: WarehouseStock[] }> = {};
      const initialAllocations: Record<string, Record<string, number>> = {};

      const promises = fullOrder.items.map(async (item) => {
        const variant = await getVariantById(item.variantId);
        const stocksPage = await getWarehouseStocksByVariant(item.variantId);
        // Filter in frontend to user's current warehouse
        const stocks = (stocksPage.content || []).filter(
          (stock) => stock.warehouseId === user?.warehouseId
        );
        detailsMap[item.orderItemId] = { variant, stocks };
        
        // Auto allocate from stock to help user pick quickly (UX excellence!)
        let remainingToPick = Number(item.quantity);
        const itemAllocations: Record<string, number> = {};
        
        for (const stock of stocks) {
          if (remainingToPick <= 0) break;
          const available = Number(stock.totalQuantity);
          if (available > 0) {
            const allocate = Math.min(remainingToPick, available);
            const stockIdKey = stock.stockId || stock.warehouseStockId || "";
            itemAllocations[stockIdKey] = allocate;
            remainingToPick -= allocate;
          }
        }
        initialAllocations[item.orderItemId] = itemAllocations;
      });

      await Promise.all(promises);

      // Resolve location names for all stocks
      const locationNames: Record<string, string> = {};
      const allStocks = Object.values(detailsMap).flatMap((d) => d.stocks);
      await Promise.all(
        allStocks.map(async (stock) => {
          const locId = stock.warehouseLocationId || stock.locationId;
          const stockKey = stock.stockId || stock.warehouseStockId || "";
          if (!locId || locationNames[stockKey]) return;
          try {
            const loc = await getLocationById(locId);
            locationNames[stockKey] = loc.locationName || loc.code || locId;
          } catch (e) {
            locationNames[stockKey] = "Unknown Bin";
          }
        })
      );

      setStockLocationNames(locationNames);
      setOrderItemsDetails(detailsMap);
      setPickingAllocations(initialAllocations);
      setPickingOrder(fullOrder);
    } catch (err: any) {
      toast.error("Failed to load picking metadata");
      console.error(err);
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleAllocationChange = (orderItemId: string, stockId: string, value: string) => {
    const qty = Math.max(0, Number(value) || 0);
    setPickingAllocations((prev) => ({
      ...prev,
      [orderItemId]: {
        ...prev[orderItemId],
        [stockId]: qty,
      },
    }));
  };

  const calculateItemAllocatedTotal = (orderItemId: string) => {
    const allocations = pickingAllocations[orderItemId] || {};
    return Object.values(allocations).reduce((sum, qty) => sum + qty, 0);
  };

  const handleFormSubmit = async () => {
    if (!pickingOrder) return;

    // Validate that all items are fully picked matching their exact quantities
    const pickingItemsDto = [];
    let totalItemsPicked = 0;

    for (const item of pickingOrder.items) {
      const allocatedTotal = calculateItemAllocatedTotal(item.orderItemId);
      const orderedQty = Number(item.quantity);

      if (allocatedTotal !== orderedQty) {
        toast.error(`Item quantity mismatch! You allocated ${allocatedTotal} of ${orderedQty} for product.`);
        return;
      }

      // Format picking items payload
      const allocations = pickingAllocations[item.orderItemId] || {};
      for (const [stockId, qty] of Object.entries(allocations)) {
        if (qty > 0) {
          pickingItemsDto.push({
            orderItemId: item.orderItemId,
            pickedItems: qty,
            warehouseStockId: stockId,
          });
          totalItemsPicked += qty;
        }
      }
    }

    setIsSubmittingPicking(true);
    try {
      await createPicking({
        orderId: pickingOrder.orderId,
        pickingItems: pickingItemsDto,
        totalItems: totalItemsPicked,
      });

      toast.success(`Picking list for ${pickingOrder.orderNumber} submitted successfully!`);
      setPickingOrder(null);
      fetchOrdersToPick();
    } catch (e: any) {
      const errMsg = e.response?.data?.message || e.message || "Failed to process picking submission";
      toast.error(errMsg);
      console.error(e);
    } finally {
      setIsSubmittingPicking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Picking</h1>
          <p className="text-sm text-muted-foreground">
            Collate and register product collections for warehouse processing.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/app/orders")}>
          <ArrowLeft size={16} className="mr-1.5" />
          All Orders
        </Button>
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
          Pending Picking ({ordersToPick.length})
        </button>
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setActiveTab("history");
            setHistoryPage(0);
          }}
        >
          Picked History
        </button>
      </div>

      {activeTab === "pending" ? (
        loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : ordersToPick.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center p-6 bg-card">
            <ClipboardList className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <h3 className="font-semibold text-sm">No Orders to Pick</h3>
            <p className="text-xs text-muted-foreground mt-1">
              There are currently no processing orders assigned to your warehouse.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* List of orders to pick */}
            <div className="divide-y border rounded-lg overflow-hidden bg-card shadow-xs">
              {ordersToPick.map((order) => (
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

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Amount</p>
                      <p className="text-base font-bold text-primary font-mono">₹{Number(order.totalAmount).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold gap-1"
                        onClick={() => navigate(`/app/orders/${order.orderId}`)}
                      >
                        <ExternalLink size={13} />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs font-semibold gap-1.5"
                        onClick={() => handleStartPicking(order.orderId)}
                        disabled={loadingOrder}
                      >
                        {loadingOrder ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Package size={13} />
                        )}
                        Start Picking
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {ordersPage && (
              <div className="flex items-center justify-between border-t bg-card px-6 py-4 rounded-lg border shadow-xs">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Rows per page</span>
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(0);
                    }}
                    className="h-8 rounded border bg-background px-2 text-xs"
                  >
                    {[10, 20, 50].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span>{ordersPage.totalElements} records</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Page</span>
                    <input
                      type="number"
                      min={1}
                      max={ordersPage.totalPages}
                      value={page + 1}
                      onChange={(e) => setPage(Math.min(ordersPage.totalPages - 1, Math.max(0, Number(e.target.value) - 1)))}
                      className="h-8 w-12 rounded border bg-background text-center text-xs"
                    />
                    <span>of {ordersPage.totalPages}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(0)} disabled={page === 0}>
                      <MoveLeft size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                      <ArrowLeft size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(Math.min(ordersPage.totalPages - 1, page + 1))} disabled={page >= ordersPage.totalPages - 1}>
                      <ArrowRight size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(ordersPage.totalPages - 1)} disabled={page >= ordersPage.totalPages - 1}>
                      <MoveRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        loadingHistory ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !historyData || historyData.content.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center p-6 bg-card">
            <ClipboardList className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <h3 className="font-semibold text-sm">No Picked History</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You haven't completed any picking lists for this warehouse yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* List of completed picking records */}
            <div className="divide-y border rounded-lg overflow-hidden bg-card shadow-xs">
              {historyData.content.map((pick) => (
                <PickingHistoryItem key={pick.pickingId} pick={pick} onDelete={() => fetchPickingHistory()} />
              ))}
            </div>

            {/* History Pagination Controls */}
            {historyData && (
              <div className="flex items-center justify-between border-t bg-card px-6 py-4 rounded-lg border shadow-xs">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Rows per page</span>
                  <select
                    value={historySize}
                    onChange={(e) => {
                      setHistorySize(Number(e.target.value));
                      setHistoryPage(0);
                    }}
                    className="h-8 rounded border bg-background px-2 text-xs"
                  >
                    {[10, 20, 50].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span>{historyData.totalElements} records</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Page</span>
                    <input
                      type="number"
                      min={1}
                      max={historyData.totalPages}
                      value={historyPage + 1}
                      onChange={(e) => setHistoryPage(Math.min(historyData.totalPages - 1, Math.max(0, Number(e.target.value) - 1)))}
                      className="h-8 w-12 rounded border bg-background text-center text-xs"
                    />
                    <span>of {historyData.totalPages}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setHistoryPage(0)} disabled={historyPage === 0}>
                      <MoveLeft size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setHistoryPage(Math.max(0, historyPage - 1))} disabled={historyPage === 0}>
                      <ArrowLeft size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setHistoryPage(Math.min(historyData.totalPages - 1, historyPage + 1))} disabled={historyPage >= historyData.totalPages - 1}>
                      <ArrowRight size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setHistoryPage(historyData.totalPages - 1)} disabled={historyPage >= historyData.totalPages - 1}>
                      <MoveRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Picking Allocation Dialog / Wizard */}
      <Dialog open={!!pickingOrder} onOpenChange={(open) => !open && setPickingOrder(null)}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-4xl w-[90vw] max-h-[85vh] overflow-y-auto p-8">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="text-primary h-5 w-5" />
                Picking Wizard: {pickingOrder?.orderNumber}
              </span>
            </DialogTitle>
          </DialogHeader>

          {pickingOrder && (
            <div className="space-y-6 py-4">
              {/* Info Banner */}
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3.5 flex items-start gap-2.5 text-xs text-foreground">
                <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Smart Allocation Active:</span> Quantities have been auto-allocated from the first available bin stock locations. Review and adjust bin quantities before completing.
                </div>
              </div>

              {/* Items List with Location Allocation */}
              <div className="space-y-6">
                {pickingOrder.items.map((item) => {
                  const details = orderItemsDetails[item.orderItemId];
                  const allocatedTotal = calculateItemAllocatedTotal(item.orderItemId);
                  const isFullyAllocated = allocatedTotal === Number(item.quantity);

                  return (
                    <div key={item.orderItemId} className="border border-muted/80 rounded-xl p-6 space-y-5 bg-muted/20 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3.5">
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-base font-bold tracking-tight text-foreground">{details?.variant?.name || "Loading Variant..."}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {details?.variant?.sku && <span className="font-mono bg-muted/65 px-2 py-0.5 rounded text-[10px]">SKU: {details.variant.sku}</span>}
                            <span>Quantity Ordered: <strong className="text-foreground">{item.quantity}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          {isFullyAllocated ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <CheckCircle2 size={12} /> Fully Picked
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <AlertCircle size={12} /> Pending ({allocatedTotal}/{item.quantity})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Bins Allocation Inputs */}
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Warehouse Stock Allocation Bins</p>
                        
                        {details?.stocks && details.stocks.length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {details.stocks.map((stock) => {
                              const stockIdKey = stock.stockId || stock.warehouseStockId || "";
                              const currentAllocation = pickingAllocations[item.orderItemId]?.[stockIdKey] || 0;
                              return (
                                <div key={stockIdKey} className="flex items-center justify-between gap-4 p-3.5 border rounded-lg bg-background hover:border-primary/20 hover:shadow-2xs transition-all">
                                  <div className="text-xs space-y-0.5">
                                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                                      <ChevronRight size={13} className="text-primary" />
                                      {stockLocationNames[stockIdKey] || "Loading bin..."}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      Stock Available: <strong className="text-foreground font-semibold">{stock.totalQuantity}</strong>
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Pick Qty:</span>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={Number(stock.totalQuantity)}
                                      value={currentAllocation === 0 ? "" : currentAllocation}
                                      onChange={(e) => handleAllocationChange(item.orderItemId, stockIdKey, e.target.value)}
                                      className="h-8.5 w-16 text-center text-xs font-bold bg-muted/30 focus-visible:bg-background"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-rose-500 italic">No stock locations found for this variant in your warehouse.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-3.5 gap-2">
            <Button variant="outline" size="sm" onClick={() => setPickingOrder(null)} disabled={isSubmittingPicking}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleFormSubmit} disabled={isSubmittingPicking}>
              {isSubmittingPicking ? "Submitting Pick..." : "Complete & Register Picking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Trash2 } from "lucide-react";

function PickingHistoryItem({ pick, onDelete }: { pick: PickingSummaryDto, onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState<any | null>(null);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [itemsNames, setItemsNames] = useState<Record<string, string>>({});

  const handleToggle = async () => {
    if (!expanded && !details) {
      setLoading(true);
      try {
        const fullPick = await getPickingById(pick.pickingId);
        setDetails(fullPick);
        if (fullPick.orderId) {
          const ord = await getOrderById(fullPick.orderId);
          setOrderInfo(ord);
          
          // Resolve item product/variant names for picking list
          const namesMap: Record<string, string> = {};
          const promises = ord.items.map(async (item) => {
            try {
              const v = await getVariantById(item.variantId);
              namesMap[item.orderItemId] = v.name;
            } catch (e) {
              namesMap[item.orderItemId] = "Product Item";
            }
          });
          await Promise.all(promises);
          setItemsNames(namesMap);
        }
      } catch (e) {
        console.error("Failed to load picking details", e);
        toast.error("Failed to load detailed picking information");
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  const formattedDate = new Date(pick.createdAt).toLocaleString();
  const pickRef = pick.pickingId.substring(0, 8).toUpperCase();
  const totalPicked = details ? Number(details.totalItems) : Number(pick.totalItems);
  const pickerLabel = orderInfo?.createdBy?.substring(0, 15) || pick.pickerName || "System Picker";

  return (
    <div className="border-b last:border-0">
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-muted/5 cursor-pointer transition-colors"
        onClick={handleToggle}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground">Pick #{pickRef}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              COMPLETED
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Associated Order: <span className="font-mono font-semibold text-foreground">{orderInfo?.orderNumber || "Click to Load"}</span> • Registered: {formattedDate}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Total Picked Items</p>
            <p className="text-sm font-bold text-foreground font-mono">
              {loading ? "..." : isNaN(totalPicked) ? "0" : totalPicked} unit(s)
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Picker: <span className="font-semibold text-foreground">{pickerLabel}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this picking record?")) {
                try {
                  await deletePicking(pick.pickingId);
                  toast.success("Picking record deleted");
                  onDelete();
                } catch (err) {
                  toast.error("Failed to delete picking record");
                }
              }
            }}
          >
            <Trash2 size={12} className="mr-1" /> Delete
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-2 bg-muted/10 border-t border-dashed animate-in fade-in duration-300">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : details && orderInfo ? (
            <div className="space-y-3 pt-2 text-xs">
              <div className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5 pb-1 border-b">
                <Package size={12} />
                Picked Items & Bin Locations allocation
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {details.pickingItems.map((pi: any, idx: number) => {
                  const name = itemsNames[pi.orderItemId] || "Product Variant Item";
                  return (
                    <div key={idx} className="flex justify-between items-center p-3.5 border rounded-lg bg-background shadow-2xs hover:border-primary/20 transition-all">
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-foreground truncate">{name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Item Ref ID: #{pi.orderItemId.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary text-sm">{pi.pickedItems} unit(s)</p>
                        <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Bin Ref: #{pi.warehouseStockId.substring(0, 5).toUpperCase()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-xs text-rose-500 italic py-2">Failed to load detailed picking information.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default PickingPage;
