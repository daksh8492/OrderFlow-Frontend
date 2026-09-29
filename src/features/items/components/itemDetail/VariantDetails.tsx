import type { Variant, VariantStatus } from "../../types/item";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import { Separator } from "@/components/ui/separator";
import type { VariantFormData } from "../../schema/variantSchema";
import VariantOptions from "./VariantOptions";
import { Tag, Barcode, IndianRupee } from "lucide-react";

function VariantDetails(props: {
  selectedVariant: Variant | undefined;
  variantStatus: Record<
    VariantStatus,
    "primary" | "warning" | "error" | "info" | "neutral"
  >;
  handleUpdateVariant: (variantId: string, data: VariantFormData) => void;
  handleDeleteVariant: (variantId: string) => void;
  handleActivateVariant: (variantId: string) => void;
  handleDeactivateVariant: (variantId: string) => void;
  handleDiscontinueVariant: (variantId: string) => void;
}) {
  const {
    selectedVariant,
    variantStatus,
    handleActivateVariant,
    handleDeactivateVariant,
    handleDiscontinueVariant,
  } = props;

  return (
    <div className="flex flex-col justify-between lg:col-span-7 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight truncate text-foreground">
            {selectedVariant?.name}
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="h-3 w-3 shrink-0" />
            <span className="font-mono font-medium text-foreground">
              {selectedVariant?.sku || "—"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge
            label={formatEnum(selectedVariant!.status)}
            variant={variantStatus[selectedVariant!.status]}
          />

          {selectedVariant && (
            <VariantOptions
              selectedVariant={selectedVariant}
              handleActivateVariant={() =>
                handleActivateVariant(selectedVariant.variantId)
              }
              handleDeactivateVariant={() =>
                handleDeactivateVariant(selectedVariant.variantId)
              }
              handleDiscontinueVariant={() =>
                handleDiscontinueVariant(selectedVariant.variantId)
              }
              handleDeleteVariant={() =>
                props.handleDeleteVariant(selectedVariant.variantId)
              }
              handleUpdateVariant={props.handleUpdateVariant}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* Prices */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <IndianRupee className="h-3 w-3" />
            Selling Price
          </div>
          <p className="mt-2 text-2xl font-bold text-primary tabular-nums">
            ₹{selectedVariant?.sellingPrice?.toLocaleString() ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <IndianRupee className="h-3 w-3" />
            Purchase Price
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
            ₹{selectedVariant?.purchasePrice?.toLocaleString() ?? "—"}
          </p>
        </div>
      </div>

      <Separator />

      {/* Barcode */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Barcode className="h-3 w-3" />
          Barcode
        </div>

        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          {selectedVariant?.barcode ? (
            <span className="font-mono text-sm tracking-widest text-foreground">
              {selectedVariant.barcode}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No barcode assigned
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VariantDetails;
