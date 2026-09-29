import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getItems, getItemById } from "@/features/items/api/itemApi";
import type { ItemSummary, Variant } from "@/features/items/types/item";

/**
 * Encapsulates the item autocomplete search logic that was duplicated in
 * OrderForm.tsx and WarehouseStockPage.tsx (multiple times).
 *
 * Handles:
 *  - Debounced search query state
 *  - API call to getItems (with 400 ms debounce)
 *  - Selected item state
 *  - Lazy-load of variants via getItemById when an item is clicked
 *
 * Usage:
 *   const itemSearch = useItemSearch();
 *   // Bind itemSearch.query / itemSearch.setQuery to the input
 *   // Pass itemSearch to <ItemVariantSearchInput>
 */
export function useItemSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ItemSummary[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemVariants, setSelectedItemVariants] = useState<Variant[]>([]);

  // Debounced fetch
  useEffect(() => {
    const fetchItems = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await getItems(0, 10, query);
        setResults(response.content || []);
      } catch (err) {
        console.error("Failed to load items", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchItems, 400);
    return () => clearTimeout(timer);
  }, [query]);

  /** Call when the user clicks an item row — lazily fetches its variants. */
  const handleItemSelect = async (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedItemVariants([]); // show loading state
    try {
      const fullItem = await getItemById(itemId);
      setSelectedItemVariants(fullItem.variants || []);
    } catch (err) {
      toast.error("Failed to load item variants");
      console.error(err);
    }
  };

  /** Resets all search state (call after a variant has been selected). */
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedItemId(null);
    setSelectedItemVariants([]);
  };

  return {
    query,
    setQuery,
    isLoading,
    results,
    selectedItemId,
    selectedItemVariants,
    handleItemSelect,
    clearSearch,
  };
}
