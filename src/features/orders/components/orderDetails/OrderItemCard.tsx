import { Card } from "@/components/ui/card";
import type { OrderItem } from "../../types/order";
import { useEffect, useState } from "react";
import { getVariantById } from "@/features/items/api/itemApi";
import { type Variant } from "@/features/items/types/item";

export default function OrderItemCard({ item }: { item: OrderItem }) {
  const [variant, setVariant] = useState<Variant>();

  const fetchVariant = async (variantId: string) => {
    const response = await getVariantById(variantId);
    setVariant(response);
  };

  useEffect(() => {
    fetchVariant(item.variantId);
  }, []);

  return (
    <Card className="border-border/60">
      {variant && (
        <div className="p-5">
          {/* Product Section */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 min-w-0">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {variant.imageUrls && variant.imageUrls.length > 0 ? (
                  <img
                    src={variant.imageUrls[0]}
                    alt={variant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold">
                    {variant.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Item #{item.serialId}
                </p>

                <h3 className="mt-1 truncate text-lg font-semibold">
                  {variant.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  SKU: {variant.sku}
                </p>

                {variant.attributes && variant.attributes.length > 0 && (
                  <p className="mt-1.5 truncate text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md inline-block">
                    {variant.attributes.map(attr => `${attr.key}: ${attr.value}`).join(" • ")}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Item Total
              </p>

              <p className="mt-1 text-xl font-bold tracking-tight text-primary">
                ₹{Number(item.itemTotal).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Divider */}

          <div className="my-4 border-t border-dashed" />

          {/* Pricing */}

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            <Info label="Quantity" value={item.quantity} />

            <Info
              label="Rate"
              value={`₹${Number(item.rate).toLocaleString()}`}
            />

            <Info label="Tax" value={`${item.taxRate}%`} />

            <Info
              label="Tax Amount"
              value={`₹${Number(item.taxAmount).toLocaleString()}`}
            />

            <Info
              label="Discount Type"
              value={
                item.discountType === "PERCENTAGE" ? "Percentage" : "Value"
              }
            />

            <Info
              label="Discount"
              value={
                item.discountType === "PERCENTAGE"
                  ? `${item.discountValue}%`
                  : `₹${Number(item.discountValue).toLocaleString()}`
              }
            />
          </div>
        </div>
      )}
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: React.ReactNode;
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
