import { type PageResponse } from "@/types/pageResponse";
import { useEffect, useState } from "react";
import {
  ITEM_CATEGORY,
  ITEM_STATUS,
  INWARD_SOURCE,
  type InwardSource,
  type ItemCategory,
  type ItemStatus,
  type ItemSummary,
} from "../types/item";
import ItemsTable from "../components/ItemsTable";
import TableToolbar from "@/components/common/TableToolbar";
import { activateItem, addItem, deactivateItem, deleteItem, discontinueItem, getItems, updateItem } from "../api/itemApi";
import { toast } from "sonner";
import AddItemDialog from "../components/AddItemDialog";
import type { ItemFormData } from "../schema/itemSchema";
import { useNavigate } from "react-router";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { Loader2 } from "lucide-react";

function ItemPage() {
  const [itemsPage, setItemsPage] =
    useState<PageResponse<ItemSummary> | null>();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { searchInput, search, setSearchInput } = useDebouncedSearch(500, () => setPage(0));

  const [status, setStatus] = useState<ItemStatus>();
  const [category, setCategory] = useState<ItemCategory>();
  const [source, setSource] = useState<InwardSource>();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems(
        page,
        size,
        search,
        category,
        status,
        source,
      );
      setItemsPage(response);
    } catch (error) {
      toast.error("Failed to load items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    setPage(0);
  }

  const handleDeactivateItem = async (id: string) => {
    try {
      await deactivateItem(id);
      toast.success("Item successfully deactivated");
      await fetchItems();
    } catch (error) {
      toast.error("Item could not be deactivated");
      console.error("Item deactivating error: ", error);
    }
  };

  const handleActivateItem = async (id: string) => {
    try {
      await activateItem(id);
      toast.success("Item successfully activated");
      await fetchItems();
    } catch (error) {
      toast.error("Item could not be activated");
      console.error("Item activating error: ", error);
    }
  };

  const handleDiscontinueItem = async (id: string) => {
    try {
      await discontinueItem(id);
      toast.success("Item successfully discontinued");
      await fetchItems();
    } catch (error) {
      toast.error("Item could not be discontinued");
      console.error("Item discontinuing error: ", error);
    }
  };

  const handleAddItem = async (data: ItemFormData) => {
    try {
      await addItem(data);
      toast.success("Item successfully added");
      await fetchItems();
    } catch (error) {
      toast.error("Item could not be added");
      console.error("Item adding error: ", error);
    }
  };

  const handleEditItem = async (id: string, data: ItemFormData) => {
    try {
      await updateItem(id, data);
      toast.success("Item successfully updated");
      await fetchItems();
    } catch (error) {
      toast.error("Item could not be updated");
      console.error("Item updating error: ", error);
    }
  };

  const onRowClick = (item: ItemSummary) => {
    navigate(`/app/items/${item.itemId}`);
  }

  useEffect(() => {
    fetchItems();
  }, [page, size, search, category, status, source]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-5">
      {/* Toolbar */}
      <div className="rounded-xl border bg-card p-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <TableToolbar
              search={{
                placeholder: "Search items...",
                value: searchInput,
                onChange: setSearchInput,
              }}
              filters={[
                {
                  placeholder: "Status",
                  value: status,
                  onChange: (value) => setStatus(value as ItemStatus | undefined),
                  allLabel: "All",
                  options: ITEM_STATUS,
                },
                {
                  placeholder: "Category",
                  value: category,
                  onChange: (value) => setCategory(value as ItemCategory | undefined),
                  allLabel: "All",
                  options: ITEM_CATEGORY,
                },
                {
                  placeholder: "Source",
                  value: source,
                  onChange: (value) => setSource(value as InwardSource | undefined),
                  allLabel: "All",
                  options: INWARD_SOURCE,
                },
              ]}
              actions={<AddItemDialog handleAddItem={handleAddItem} />}
            />
          </div>
        </div>
      </div>

      {/* Item count */}
      {itemsPage && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            {itemsPage.totalElements}{" "}
            {itemsPage.totalElements === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : itemsPage ? (
          <ItemsTable
            items={itemsPage.content}
            page={page}
            size={size}
            totalElements={itemsPage.totalElements}
            totalPages={itemsPage.totalPages}
            onPageChange={setPage}
            onSizeChange={setSize}
            handleDelete={handleDeleteItem}
            handleActivateItem={handleActivateItem}
            handleDeactivateItem={handleDeactivateItem}
            handleDiscontinueItem={handleDiscontinueItem}
            handleEditItem={handleEditItem}
            onRowClick={onRowClick}
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No items found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemPage;
