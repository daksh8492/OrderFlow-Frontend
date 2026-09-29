import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Variant } from "@/features/items/types/item";
import type { useItemSearch } from "@/hooks/useItemSearch";

interface ItemVariantSearchInputProps {
  /** Pass the object returned by the `useItemSearch()` hook. */
  itemSearch: ReturnType<typeof useItemSearch>;
  /** Called when the user picks a variant. Receives the variant and its parent item name. */
  onVariantSelect: (variant: Variant, itemName: string) => void;
  placeholder?: string;
  inputClassName?: string;
  id?: string;
}

/**
 * Reusable autocomplete component for searching items and selecting a variant.
 *
 * Pair this with the `useItemSearch()` hook which owns all the state and API logic.
 *
 * Example:
 *   const itemSearch = useItemSearch();
 *   <ItemVariantSearchInput
 *     itemSearch={itemSearch}
 *     onVariantSelect={(variant, itemName) => { ... }}
 *   />
 */
export function ItemVariantSearchInput({
  itemSearch,
  onVariantSelect,
  placeholder = "Search item name...",
  inputClassName = "",
  id = "itemSearchInput",
}: ItemVariantSearchInputProps) {
  const { query, setQuery, isLoading, results, selectedItemId, selectedItemVariants, handleItemSelect } =
    itemSearch;

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          id={id}
          className={`pl-8 h-8 text-xs ${inputClassName}`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute right-2 top-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Results Dropdown */}
      {query && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-56 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md text-xs">
          {results.map((item) => (
            <div key={item.itemId} className="flex flex-col border-b last:border-0">
              {/* Item row */}
              <div
                className="flex cursor-pointer items-center justify-between px-2.5 py-1.5 hover:bg-muted font-medium"
                onClick={() => handleItemSelect(item.itemId)}
              >
                <span>{item.name}</span>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.variantCount} Variant(s)
                </span>
              </div>

              {/* Expanded variant list */}
              {selectedItemId === item.itemId && (
                <div className="bg-muted/40 px-2 py-1 space-y-1 border-t">
                  {selectedItemVariants.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground block py-1">
                      Loading...
                    </span>
                  ) : (
                    selectedItemVariants.map((v) => (
                      <div
                        key={v.variantId}
                        className="flex items-center justify-between text-[10px] py-1 px-1.5 hover:bg-accent rounded cursor-pointer"
                        onClick={() => onVariantSelect(v, item.name)}
                      >
                        <span className="font-mono text-muted-foreground">
                          {v.sku || "No SKU"} - {v.name}
                        </span>
                        <span className="font-bold text-foreground">₹{v.sellingPrice}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
