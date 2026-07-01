import type { Variant, VariantStatus } from "../../types/item";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import { Separator } from "@/components/ui/separator";
import type { VariantFormData } from "../../schema/variantSchema";
import VariantOptions from "./VariantOptions";

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
    <div className="flex flex-col justify-between lg:col-span-7">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight ">
              {selectedVariant?.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              SKU ·{" "}
              <span className="font-medium text-foreground">
                {selectedVariant?.sku}
              </span>
            </p>
          </div>

          <StatusBadge
            label={formatEnum(selectedVariant!.status)}
            variant={variantStatus[selectedVariant!.status]}
          />

          {selectedVariant ? (
            <div>
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
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <Separator />

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border bg-background p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Selling Price
            </p>

            <p className="mt-2 text-3xl font-bold text-primary">
              ₹{selectedVariant?.sellingPrice?.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Purchase Price
            </p>

            <p className="mt-2 text-3xl font-bold">
              ₹{selectedVariant?.purchasePrice?.toLocaleString()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Barcode */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Barcode
          </p>

          <div className="mt-2 rounded-lg bg-muted px-4 py-3">
            <span className="font-mono text-lg tracking-wider">
              {selectedVariant?.barcode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantDetails;
