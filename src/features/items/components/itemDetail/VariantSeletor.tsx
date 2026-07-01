import { Button } from "@/components/ui/button";
import type { Variant } from "../../types/item"

function VariantSeletor(props: {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    setSelectedVariant: (data: Variant) => void
}) {

    const {variants, selectedVariant, setSelectedVariant} = props;

  return (


    <div className="flex flex-wrap gap-3 overflow-x-auto">
            {variants.map((variant) => (
              <Button
                key={variant.variantId}
                variant={
                  selectedVariant?.variantId === variant.variantId
                    ? "default"
                    : "secondary"
                }
                className="rounded-full px-5"
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.name}
              </Button>
            ))}
          </div>
  )
}

export default VariantSeletor