import { Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { OrderFormData } from "../../schema/orderSchema";


interface OrderItemsSectionProps {
  isLoading?: boolean;
}

export default function OrderItemsSection({
  isLoading = false,
}: OrderItemsSectionProps) {
  const { watch } = useFormContext<OrderFormData>();

  const items = watch("items");

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Order Items</h2>

          <p className="text-sm text-muted-foreground">
            Add products to this order.
          </p>
        </div>

        <Button
          type="button"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="font-medium">No items added</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Click <strong>Add Item</strong> to begin building this order.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.variantId}
              className="rounded-lg border p-4"
            >
              Item {index + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}