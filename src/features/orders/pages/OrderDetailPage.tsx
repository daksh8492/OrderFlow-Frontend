import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Warehouse,
  MapPin,
  Phone,
  Package,
  CheckCircle2,
  Receipt,
  FileText,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { type Order, type OrderItem } from "../types/order";
import { getOrderById, updateOrder } from "../apis/orderApi";
import { getVariantById } from "@/features/items/api/itemApi";
import { type Variant } from "@/features/items/types/item";
import OrderForm from "../components/orderForm/OrderForm";
import { type OrderFormData } from "../schema/orderSchema";
import { formatEnum } from "@/utils/format";
import { StatusBadge } from "@/components/common/StatusBadge";
// import {
//   orderStatusVariant,
//   paymentStatusVariant,
//   priorityVariant,
// } from "../../constants/orderConstants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orderStatusVariant, paymentStatusVariant, priorityVariant } from "../constants/orderConstants";

// Status stages for the visual timeline tracker
const TIMELINE_STAGES = [
  { key: "PENDING", label: "Placed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      if (!id) {
        navigate("/app/orders");
        return;
      }
      const response = await getOrderById(id);
      setOrder(response);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateOrder = async (data: OrderFormData) => {
    if (!order) return;
    setIsSaving(true);
    try {
      const updated = await updateOrder(order.orderId, data);
      toast.success("Order updated successfully!");
      setOrder(updated);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-bold">Order Not Found</h3>
        <p className="text-sm text-muted-foreground">The order details could not be retrieved.</p>
        <Button onClick={() => navigate("/app/orders")}>Back to Orders</Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-6xl mx-auto py-6">
        <OrderForm
          defaultValues={order}
          onSubmit={handleUpdateOrder}
          isLoading={isSaving}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // Calculate current stage index for visual timeline
  const getCurrentStageIndex = (status: string) => {
    if (status === "CANCELLED" || status === "FAILED") return -1;
    if (status === "DELIVERED" || status === "COMPLETED") return 3;
    if (status === "SHIPPED" || status === "OUT_FOR_DELIVERY") return 2;
    if (status === "PROCESSING" || status === "PICKED" || status === "PACKED") return 1;
    return 0; // PENDING
  };

  const currentStageIndex = getCurrentStageIndex(order.status);
  const totalQuantity = order.items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumbs / Back button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground animate-in fade-in duration-300"
          onClick={() => navigate("/app/orders")}
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all"
          onClick={() => setIsEditing(true)}
        >
          <Pencil size={13} />
          Edit Order
        </Button>
      </div>

      {/* Main Order Title & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-lg p-6 shadow-xs">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Order Ref</p>
          <h1 className="text-3xl font-extrabold tracking-tight font-mono">{order.orderNumber}</h1>
          <div className="flex flex-wrap gap-6 pt-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order Status</span>
              <StatusBadge label={formatEnum(order.status)} variant={orderStatusVariant[order.status]} />
            </div>
            <div className="w-px h-8 bg-border hidden sm:block self-end" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payment Status</span>
              <StatusBadge label={formatEnum(order.paymentStatus)} variant={paymentStatusVariant[order.paymentStatus]} />
            </div>
            <div className="w-px h-8 bg-border hidden sm:block self-end" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Priority</span>
              <StatusBadge label={formatEnum(order.priority)} variant={priorityVariant[order.priority]} />
            </div>
          </div>
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0">
          <span className="text-xs text-muted-foreground">Total Invoice Value</span>
          <h2 className="text-3xl font-black text-primary tracking-tight mt-0.5">
            ₹{Number(order.totalAmount).toLocaleString()}
          </h2>
          <span className="text-[10px] text-muted-foreground">Paid via Cash/Bank transfer</span>
        </div>
      </div>

      {/* 3-Column Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Timeline, Items & Delivery (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Order Timeline Status Tracker */}
          {order.status !== "CANCELLED" && order.status !== "FAILED" && (
            <Card className="border shadow-xs">
              <CardContent className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Delivery Progress</h3>
                <div className="relative flex justify-between items-center w-full">
                  {/* Background progress bar */}
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted -translate-y-1/2 z-0" />

                  {/* Foreground progress bar based on current stage */}
                  <div
                    className="absolute left-0 top-1/2 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${currentStageIndex === -1 ? 0 : (currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100}%`,
                    }}
                  />

                  {TIMELINE_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="flex flex-col items-center z-10">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted
                              ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "bg-background border-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <span className="text-xs font-semibold">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`mt-2 text-xs font-semibold ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                            }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancelled Alert Banner */}
          {(order.status === "CANCELLED" || order.status === "FAILED") && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3 text-destructive">
              <AlertTriangle size={20} />
              <div className="text-sm">
                <span className="font-bold">Order was {formatEnum(order.status)}:</span> This order was terminated and cannot be fulfilled.
              </div>
            </div>
          )}

          {/* List of Order Items Section */}
          <Card className="border shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Order Items</h3>
                <span className="text-xs text-muted-foreground">
                  {order.items.length} Product(s) • Total Quantity: {totalQuantity}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">No items added to this order.</div>
                ) : (
                  order.items.map((item) => <OrderDetailRow key={item.orderItemId} item={item} />)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Address Information Card */}
          <Card className="border shadow-xs">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-3">Receiver Details</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Name</p>
                    <p className="text-sm font-semibold truncate mt-0.5">{order.receiverName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Contact Phone</p>
                    <p className="text-sm font-medium mt-0.5">{order.receiverPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-1">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Shipping Address</p>
                    <p className="text-xs text-foreground leading-relaxed mt-0.5">{order.receiverAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Financial Invoice Summary & Quick Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Pricing Details */}
          <Card className="border shadow-xs">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-3 flex items-center gap-1.5">
                <Receipt size={15} />
                Financial Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gross Subtotal</span>
                  <span className="font-semibold font-mono text-foreground">
                    ₹{Number(order.subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-rose-500">
                  <span>Applied Discounts</span>
                  <span className="font-semibold font-mono">
                    -₹{Number(order.totalDiscount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Fulfill Taxes</span>
                  <span className="font-semibold font-mono">
                    +₹{Number(order.totalTax).toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-dashed my-3" />

                <div className="bg-primary/5 rounded-lg p-3.5 flex items-center justify-between border border-primary/10">
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">Total Value</span>
                  <span className="text-xl font-extrabold text-primary tracking-tight font-mono">
                    ₹{Number(order.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Information Cards (Dates, Creator, Warehouse) */}
          <Card className="border shadow-xs">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-3">Fulfillment Meta</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Order Date</p>
                    <p className="font-medium mt-0.5">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Created Date Timestamp</p>
                    <p className="font-medium mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Assigned Warehouse</p>
                    <p className="font-medium mt-0.5">
                      {order.fulfillingWarehouseId ? (
                        <span className="font-mono bg-muted/80 px-1.5 py-0.5 rounded text-[10px]">
                          {order.fulfillingWarehouseId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Not Assigned</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Processed By User</p>
                    <p className="font-mono mt-0.5 bg-muted/80 px-1.5 py-0.5 rounded text-[10px] inline-block">
                      {order.createdBy.substring(0, 18)}...
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border shadow-xs">
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full text-xs h-9 justify-start gap-2" onClick={() => window.print()}>
                <FileText size={14} />
                Print Order Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Inner helper component for loading variant details and rendering table items neatly
function OrderDetailRow({ item }: { item: OrderItem }) {
  const [variant, setVariant] = useState<Variant>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        setLoading(true);
        const res = await getVariantById(item.variantId);
        setVariant(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVariant();
  }, [item.variantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-muted last:border-0">
        <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-background flex items-center justify-center">
          {variant?.imageUrls && variant.imageUrls.length > 0 ? (
            <img src={variant.imageUrls[0]} alt={variant.name} className="h-full w-full object-cover" />
          ) : (
            <Package size={20} className="text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-[9px] font-mono text-muted-foreground uppercase">Item Ref #{item.serialId}</p>
          <h4 className="text-sm font-bold text-foreground truncate">{variant?.name || "Unknown Product"}</h4>
          {variant?.sku && <span className="text-[10px] text-muted-foreground font-mono">SKU: {variant.sku}</span>}
          {variant?.attributes && variant.attributes.length > 0 && (
            <div className="text-[10px] text-muted-foreground">
              {variant.attributes.map(a => `${a.key}: ${a.value}`).join(" • ")}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Qty</p>
          <p className="text-xs font-semibold mt-0.5">{item.quantity}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Rate</p>
          <p className="text-xs font-semibold mt-0.5">₹{Number(item.rate).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Disc/Tax</p>
          <p className="text-[10px] mt-0.5 text-muted-foreground">
            -₹{Number(item.discountAmount).toFixed(0)} ({item.discountType === "PERCENTAGE" ? `${item.discountValue}%` : "val"})
            <br />
            +₹{Number(item.taxAmount).toFixed(0)} ({item.taxRate}%)
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-primary mt-0.5">₹{Number(item.itemTotal).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
