import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "../../types/order";
import OrderItemCard from "./OrderItemCard";

export default function OrderItemsSection({ order }: { order: Order }) {
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Order Items</CardTitle>

          <div className="text-sm text-muted-foreground">
            {order.items.length} Item{order.items.length !== 1 && "s"} • Total
            Qty {totalQuantity}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {order.items.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              No items found in this order.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {order.items.map((item) => (
              <OrderItemCard key={item.orderItemId} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
