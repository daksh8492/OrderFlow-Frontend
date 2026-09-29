import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ClipboardList, ExternalLink, Warehouse, ArrowLeft, Loader2, ArrowRight, MoveLeft, MoveRight } from "lucide-react";

import { type OrderSummary } from "../types/order";
import { getOrdersByStatus, assignWarehouse } from "../apis/orderApi";
import { getWarehouses } from "@/features/warehouses/api/warehouseApi";
import type { Warehouse as WarehouseType } from "@/features/warehouses/types/warehouse";
import { type PageResponse } from "@/types/pageResponse";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

function FulfillmentPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [ordersPage, setOrdersPage] = useState<PageResponse<OrderSummary>>();
  const [loading, setLoading] = useState(true);

  // Assignment Dialog State
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersByStatus("PENDING", page, size);
      setOrdersPage(res);
    } catch (err) {
      toast.error("Failed to load pending orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouses = async () => {
    try {
      const res = await getWarehouses(0, 50);
      setWarehouses(res.content || []);
    } catch (err) {
      toast.error("Failed to load warehouses");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, [page, size]);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleOpenAssignDialog = (order: OrderSummary) => {
    setSelectedOrder(order);
    setSelectedWarehouseId("");
  };

  const handleAssignWarehouse = async () => {
    if (!selectedOrder || !selectedWarehouseId) return;
    setIsAssigning(true);
    try {
      await assignWarehouse(selectedOrder.orderId, selectedWarehouseId);
      toast.success(`Warehouse assigned to ${selectedOrder.orderNumber}! Status updated to PROCESSING.`);
      setSelectedOrder(null);
      fetchPendingOrders();
    } catch (e: any) {
      const errMsg = e.response?.data?.message || e.message || "Failed to assign warehouse";
      toast.error(errMsg);
      console.error(e);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Fulfillments</h1>
          <p className="text-sm text-muted-foreground">Assign warehouses to process incoming orders.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/app/orders")}>
          <ArrowLeft size={16} className="mr-1.5" />
          All Orders
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !ordersPage || ordersPage.content.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center p-6 bg-card">
          <ClipboardList className="h-10 w-10 text-muted-foreground/60 mb-2" />
          <h3 className="font-semibold text-sm">No Pending Orders</h3>
          <p className="text-xs text-muted-foreground mt-1">All incoming orders have been assigned fulfillment warehouses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List of pending orders */}
          <div className="divide-y border rounded-lg overflow-hidden bg-card shadow-xs">
            {ordersPage.content.map((order) => (
              <div key={order.orderId} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:bg-muted/10 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{order.orderNumber}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
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
                      onClick={() => handleOpenAssignDialog(order)}
                    >
                      <Warehouse size={13} />
                      Assign Warehouse
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
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
        </div>
      )}

      {/* Warehouse Assignment Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Warehouse className="text-primary h-5 w-5" />
              Assign Fulfillment Warehouse
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="rounded-md bg-muted/40 p-3.5 border text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Ref:</span>
                  <span className="font-mono font-semibold">{selectedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold">{selectedOrder.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-bold text-primary">₹{Number(selectedOrder.totalAmount).toLocaleString()}</span>
                </div>
              </div>

              <Field>
                <FieldLabel className="text-xs">Select Warehouse</FieldLabel>
                <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Choose fulfilling warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.warehouseId} value={w.warehouseId}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)} disabled={isAssigning}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAssignWarehouse} disabled={!selectedWarehouseId || isAssigning}>
              {isAssigning ? "Processing..." : "Process & Fulfill Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FulfillmentPage;
