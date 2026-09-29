import { Button } from "@/components/ui/button";
import type { Variant } from "../../types/item"

function VariantSeletor(props: {
  variants: Variant[],
  selectedVariant: Variant | undefined,
  setSelectedVariant: (data: Variant) => void
}) {
  const { variants, selectedVariant, setSelectedVariant } = props;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Variants
          <span className="ml-1.5 font-bold text-foreground">({variants.length})</span>
        </p>
      </div>

      {/* Variant pills */}
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Button
            key={variant.variantId}
            variant={
              selectedVariant?.variantId === variant.variantId
                ? "default"
                : "outline"
            }
            size="sm"
            className="rounded-full h-8 px-4 text-xs font-medium"
            onClick={() => setSelectedVariant(variant)}
          >
            {variant.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default VariantSeletor