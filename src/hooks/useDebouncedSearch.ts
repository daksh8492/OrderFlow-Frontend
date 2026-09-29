import { useEffect, useState } from "react";

/**
 * Encapsulates the debounced search input pattern that is repeated across all
 * listing pages (CustomerPage, VendorsPage, UsersPage, ItemPage, etc.).
 *
 * Usage:
 *   const { searchInput, search, setSearchInput, resetSearch } = useDebouncedSearch();
 *
 * @param delay  Debounce delay in milliseconds (default: 500).
 * @param onSearchCommit  Optional callback fired when the debounced value settles.
 *                        Receives the final search string and resets the page.
 */
export function useDebouncedSearch(
  delay = 500,
  onSearchCommit?: (value: string) => void,
) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      onSearchCommit?.(searchInput);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchInput, delay]);

  const resetSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  return { searchInput, search, setSearchInput, resetSearch };
}
