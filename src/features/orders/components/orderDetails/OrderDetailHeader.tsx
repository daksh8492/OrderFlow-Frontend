import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  User,
  Warehouse,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import { useNavigate } from "react-router";
import type { Order } from "../../types/order";
import {
  orderStatusVariant,
  paymentStatusVariant,
  priorityVariant,
} from "../../constants/orderConstants";
import { Card } from "@/components/ui/card";

function OrderDetailHeader({
  order,
  onEdit,
}: {
  order: Order;
  onEdit?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="p-6">
        {/* Top */}

        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2 px-0 hover:bg-transparent"
            onClick={() => navigate("/app/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>

          {onEdit && (
            <Button onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Order
            </Button>
          )}
        </div>

        {/* Middle */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Order Number
              </p>

              <h1 className="mt-1 text-4xl font-bold tracking-tight">
                {order.orderNumber}
              </h1>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </p>

                <StatusBadge
                  label={formatEnum(order.status)}
                  variant={orderStatusVariant[order.status]}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment
                </p>

                <StatusBadge
                  label={formatEnum(order.paymentStatus)}
                  variant={paymentStatusVariant[order.paymentStatus]}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Priority
                </p>

                <StatusBadge
                  label={order.priority}
                  variant={priorityVariant[order.priority]}
                />
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="text-left lg:text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>

            <h2 className="mt-1 text-4xl font-black tracking-tight">
              ₹{Number(order.totalAmount).toLocaleString()}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Including tax & discounts
            </p>
          </div>
        </div>

        {/* Divider */}

        <div className="my-6 border-t" />

        {/* Bottom */}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Order Date"
            value={new Date(order.orderDate).toLocaleString()}
          />

          <InfoItem
            icon={<Clock className="h-4 w-4" />}
            label="Created At"
            value={new Date(order.createdAt).toLocaleString()}
          />

          <InfoItem
            icon={<Warehouse className="h-4 w-4" />}
            label="Warehouse"
            value={
              order.fulfillingWarehouseId ? (
                <span className="font-mono text-sm">
                  {order.fulfillingWarehouseId}
                </span>
              ) : (
                <span className="text-muted-foreground">Not Assigned</span>
              )
            }
          />

          <InfoItem
            icon={<User className="h-4 w-4" />}
            label="Created By"
            value={<span className="font-mono text-sm">{order.createdBy}</span>}
          />
        </div>
      </div>
    </Card>
  );
}

export default OrderDetailHeader;

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-muted p-2 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <div className="mt-1 font-medium break-all">{value}</div>
      </div>
    </div>
  );
}
