import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Package, 
  Loader2, 
  Plus, 
  ChevronRight, 
  Boxes, 
  Search, 
  MapPin, 
  FolderOpen,
  Trash2,
  Edit3,
  Layers,
  X,
  Warehouse as WarehouseIcon,
  ArrowRightLeft
} from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { getWarehouses } from "@/features/warehouses/api/warehouseApi";
import { type Warehouse } from "@/features/warehouses/types/warehouse";
import { 
  getStocksByLocation, 
  getWarehouseStocksByVariant,
  addStock, 
  updateStock, 
  deleteStock, 
  type WarehouseStock 
} from "../api/warehouseStockApi";
import { getVariantById } from "@/features/items/api/itemApi";
import { getRootLocations, getChildLocations, getLocationById } from "@/features/locations/api/locationApi";
import { type Variant } from "@/features/items/types/item";
import { type Location } from "@/features/locations/types/location";
import { useItemSearch } from "@/hooks/useItemSearch";
import { ItemVariantSearchInput } from "@/components/common/ItemVariantSearchInput";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function WarehouseStockPage() {
  const user = useAppSelector((state) => state.auth.user);

  // Warehouses list
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  // View state toggle: "locations" | "variants"
  const [viewMode, setViewMode] = useState<"locations" | "variants">("locations");

  // Record Stock Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [binsList, setBinsList] = useState<Location[]>([]);
  const [loadingModalData, setLoadingModalData] = useState(false);

  // Record Form state
  const [formVariantId, setFormVariantId] = useState("");
  const [formVariantName, setFormVariantName] = useState("");
  const [formLocationId, setFormLocationId] = useState("");
  const [formQty, setFormQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Final Selected Variant stock inspection
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [variantStocks, setVariantStocks] = useState<WarehouseStock[]>([]);
  const [loadingVariantStocks, setLoadingVariantStocks] = useState(false);

  // Item search for the main "Variant Finder" view
  const variantFinderSearch = useItemSearch();

  // Item search for the "Record Input Stock" dialog
  const dialogItemSearch = useItemSearch();

  // Load Warehouses on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoadingWarehouses(true);
        const res = await getWarehouses(0, 100);
        setWarehouses(res.content);
        if (user?.warehouseId) {
          setSelectedWarehouseId(user.warehouseId);
        }
      } catch (err) {
        toast.error("Failed to load warehouses list");
        console.error(err);
      } finally {
        setLoadingWarehouses(false);
      }
    };
    fetchWarehouses();
  }, [user?.warehouseId]);

  const handleVariantSelect = (variant: Variant, itemName: string) => {
    setSelectedVariant({
      ...variant,
      name: `${itemName} - ${variant.name}`
    });
    variantFinderSearch.clearSearch();
  };

  const handleDialogVariantSelect = (variant: Variant, itemName: string) => {
    setFormVariantId(variant.variantId);
    setFormVariantName(`${itemName} - ${variant.name}`);
    dialogItemSearch.clearSearch();
  };

  const loadDialogHelperData = async () => {
    if (!selectedWarehouseId) return;
    try {
      setLoadingModalData(true);
      const rootLocs = await getRootLocations(selectedWarehouseId);
      const bins: Location[] = [];
      
      const loadBinsRecursively = async (locs: Location[]) => {
        for (const loc of locs) {
          if (loc.locationType === "BIN") {
            bins.push(loc);
          } else {
            try {
              const children = await getChildLocations(loc.locationId);
              await loadBinsRecursively(children);
            } catch (e) {
              console.error(e);
            }
          }
        }
      };

      await loadBinsRecursively(rootLocs);
      setBinsList(bins);
    } catch (err) {
      toast.error("Failed to load bin locations");
      console.error(err);
    } finally {
      setLoadingModalData(false);
    }
  };

  const handleOpenAddStock = () => {
    setIsOpen(true);
    setFormVariantId("");
    setFormVariantName("");
    setFormLocationId("");
    setFormQty(1);
    dialogItemSearch.clearSearch();
    loadDialogHelperData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVariantId || !formLocationId || formQty <= 0) {
      toast.error("Please fill all stock fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addStock({
        warehouseId: selectedWarehouseId,
        variantId: formVariantId,
        locationId: formLocationId,
        warehouseLocationId: formLocationId,
        totalQuantity: formQty,
      });
      toast.success("Stock registered successfully!");
      setIsOpen(false);
      setFormVariantId("");
      setFormLocationId("");
      setFormQty(1);
      
      if (selectedVariant) {
        handleSearchVariantStocks(selectedVariant.variantId);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to record stock";
      toast.error(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchVariantStocks = async (variantId: string) => {
    if (!variantId || !selectedWarehouseId) return;
    try {
      setLoadingVariantStocks(true);
      const res = await getWarehouseStocksByVariant(variantId);
      const filtered = res.content.filter(s => s.warehouseId === selectedWarehouseId);
      setVariantStocks(filtered);
    } catch (err) {
      toast.error("Failed to find stock levels for this variant");
      console.error(err);
    } finally {
      setLoadingVariantStocks(false);
    }
  };

  useEffect(() => {
    if (selectedVariant && selectedWarehouseId) {
      handleSearchVariantStocks(selectedVariant.variantId);
    } else {
      setVariantStocks([]);
    }
  }, [selectedVariant, selectedWarehouseId]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner Control Panel */}
      <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-2">
        
        <div className="flex items-center gap-2.5">
          {/* Warehouse Selector */}
          <div className="flex items-center gap-2 border rounded-lg bg-card px-3 py-1.5 shadow-2xs">
            <WarehouseIcon size={14} className="text-primary" />
            <Select
              value={selectedWarehouseId}
              onValueChange={(val) => {
                setSelectedWarehouseId(val);
                setSelectedVariant(null);
              }}
              disabled={loadingWarehouses}
            >
              <SelectTrigger className="h-fit py-0 px-0 bg-transparent border-0 shadow-none text-xs font-bold focus:ring-0 focus:ring-offset-0 [&>svg]:ml-1 w-[210px] min-h-0 data-[size=default]:h-auto">
                <SelectValue placeholder="-- Select Warehouse Workspace --" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.warehouseId} value={w.warehouseId}>
                    {w.name} ({w.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Toggle View Mode Button */}
          {selectedWarehouseId && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-bold"
              onClick={() => {
                setViewMode(viewMode === "locations" ? "variants" : "locations");
                setSelectedVariant(null);
                variantFinderSearch.clearSearch();
              }}
            >
              {viewMode === "locations" ? (
                <>
                  <Search size={14} className="text-primary" />
                  Search by Variant
                </>
              ) : (
                <>
                  <Layers size={14} className="text-primary" />
                  View Location Directory
                </>
              )}
            </Button>
          )}

          {selectedWarehouseId && (
            <Button size="sm" className="gap-1.5 text-xs font-bold shadow-2xs" onClick={handleOpenAddStock}>
              <Plus size={14} />
              Record Input
            </Button>
          )}
        </div>
      </div>

      {!selectedWarehouseId ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed text-center p-8 bg-card shadow-2xs animate-in fade-in">
          <WarehouseIcon className="h-12 w-12 text-muted-foreground/40 mb-3 animate-pulse" />
          <h3 className="font-bold text-sm text-foreground">Select a Warehouse</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
            Please select a warehouse workspace from the top menu to view bins or execute variant search queries.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {viewMode === "locations" ? (
            /* LOCATION DIRECTORY VIEW */
            <LocationHierarchyView warehouseId={selectedWarehouseId} />
          ) : (
            /* VARIANT FINDER VIEW (SEARCH AUTOCOMPLETE LIKE CREATE ORDER) */
            <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
              
              {/* autocomplete finder wrapper */}
              <div className="bg-card border rounded-xl p-6 shadow-xs space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Search size={13} className="text-primary" />
                    Search Item & Select Variant
                  </label>

                  {/* Autocomplete Input — uses shared ItemVariantSearchInput component */}
                  <ItemVariantSearchInput
                    itemSearch={variantFinderSearch}
                    onVariantSelect={handleVariantSelect}
                    placeholder="Search variant name (e.g. apple, iphone, item)..."
                    inputClassName="h-10 font-semibold focus-visible:ring-1 bg-background"
                  />
                </div>

                {/* Selected variant details display */}
                {selectedVariant && (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/10 text-xs">
                    <div>
                      <p className="font-bold text-foreground">Selected variant:</p>
                      <p className="text-[11px] text-primary font-semibold mt-0.5">{selectedVariant.name}</p>
                      {selectedVariant.sku && <p className="text-[9px] text-muted-foreground font-mono mt-0.5">SKU: {selectedVariant.sku}</p>}
                    </div>
                    <button
                      onClick={() => setSelectedVariant(null)}
                      className="text-muted-foreground hover:text-foreground p-1 border rounded bg-background focus:outline-none transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              {loadingVariantStocks ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !selectedVariant ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 bg-card/40">
                  <Search className="h-9 w-9 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">Select a product variant above to query stock bin locations.</p>
                </div>
              ) : variantStocks.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 bg-card">
                  <Boxes className="h-9 w-9 text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-semibold text-foreground">No Stock Allocated</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">This product variant holds 0 units in this warehouse.</p>
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden bg-card shadow-2xs animate-in fade-in">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b bg-muted/25 font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
                        <th className="p-4">Location Bin</th>
                        <th className="p-4">Location Type</th>
                        <th className="p-4 text-right">Physical Quantity</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variantStocks.map((stock) => (
                        <VariantStockRow key={stock.stockId || stock.warehouseStockId} stock={stock} onRefresh={() => handleSearchVariantStocks(selectedVariant.variantId)} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Record Input Stock Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader className="border-b pb-3.5">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Package className="text-primary h-5 w-5" />
              Record Warehouse Input Stock
            </DialogTitle>
          </DialogHeader>

          {loadingModalData ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-3">
              {/* Product Variant Autocomplete */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Product Variant</label>

                {formVariantId ? (
                  /* Selected variant pill */
                  <div className="flex items-center justify-between p-2.5 border rounded-lg bg-primary/5 border-primary/15 text-xs">
                    <div>
                      <p className="font-bold text-foreground text-[11px]">{formVariantName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFormVariantId(""); setFormVariantName(""); }}
                      className="text-muted-foreground hover:text-foreground p-1 border rounded bg-background focus:outline-none transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <ItemVariantSearchInput
                    itemSearch={dialogItemSearch}
                    onVariantSelect={handleDialogVariantSelect}
                    placeholder="Search item name..."
                    inputClassName="h-9 font-semibold"
                    id="dialogItemSearchInput"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Bin Location</label>
                <Select
                  value={formLocationId}
                  onValueChange={setFormLocationId}
                >
                  <SelectTrigger className="w-full h-9 rounded-md bg-background text-foreground text-xs font-medium">
                    <SelectValue placeholder="-- Choose Bin Location --" />
                  </SelectTrigger>
                  <SelectContent>
                    {binsList.map((l) => (
                      <SelectItem key={l.locationId} value={l.locationId}>
                        {l.locationName ?? l.code} ({l.locationType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantity to Add</label>
                <Input
                  type="number"
                  min={1}
                  value={formQty}
                  onChange={(e) => setFormQty(Number(e.target.value))}
                  className="h-9 text-xs font-semibold"
                />
              </div>

              <DialogFooter className="pt-4 border-t gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Stock Allocation"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ==========================================
   VIEW COMPONENT: LOCATION HIERARCHY DIRECTORY
   ========================================== */
function LocationHierarchyView({ warehouseId }: { warehouseId: string }) {
  const [rootLocations, setRootLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoot = async () => {
    try {
      setLoading(true);
      const res = await getRootLocations(warehouseId);
      setRootLocations(res);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load root locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoot();
  }, [warehouseId]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (rootLocations.length === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 bg-card">
        <MapPin className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-xs text-muted-foreground">No locations recorded in this warehouse yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-250">
      <div className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5">
        <Layers size={12} className="text-primary" />
        Locations Directory Tree (Expand levels recursively to inspect allocated stocks)
      </div>
      <div className="border border-muted/80 rounded-xl p-6 bg-muted/20 shadow-2xs space-y-3.5">
        {rootLocations.map((loc) => (
          <LazyLocationNode key={loc.locationId} location={loc} />
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   COMPONENT: LAZY LOCATION DIRECTORY NODE
   ========================================== */
function LazyLocationNode({ location }: { location: Location }) {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState<Location[] | null>(null);
  const [stocksList, setStocksList] = useState<WarehouseStock[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!open) {
      setLoading(true);
      try {
        if (location.locationType === "BIN") {
          const res = await getStocksByLocation(location.locationId, 0, 100);
          setStocksList(res.content);
        } else {
          const childrenLocs = await getChildLocations(location.locationId);
          setChildren(childrenLocs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    setOpen(!open);
  };

  const isLeaf = location.locationType === "BIN";

  return (
    <div className="pl-4 border-l border-muted/60 py-1.5 animate-in fade-in duration-200">
      <div 
        className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg hover:bg-background/85 cursor-pointer text-xs transition-all hover:translate-x-0.5"
        onClick={handleToggle}
      >
        <ChevronRight size={13} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        <FolderOpen size={13} className={isLeaf ? "text-primary" : "text-amber-500"} />
        <span className="font-bold text-foreground">
          {location.locationName ?? location.code}
        </span>
        <span className="text-[9px] font-bold text-muted-foreground px-1.5 py-0.25 bg-muted rounded font-mono uppercase">
          {location.locationType}
        </span>
      </div>

      {open && (
        <div className="pl-5 mt-1 space-y-1">
          {loading ? (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground pl-3 py-2">
              <Loader2 size={12} className="animate-spin text-primary" /> Loading items...
            </div>
          ) : isLeaf ? (
            !stocksList || stocksList.length === 0 ? (
              <div className="text-[10px] text-muted-foreground/80 italic pl-3 py-1.5">Empty location (No stock units recorded)</div>
            ) : (
              <div className="space-y-2 pl-3 py-2 max-w-xl">
                {stocksList.map((st) => (
                  <BinStockMiniRow key={st.warehouseStockId || st.stockId} stock={st} onRefresh={async () => {
                    const res = await getStocksByLocation(location.locationId, 0, 100);
                    setStocksList(res.content);
                  }} />
                ))}
              </div>
            )
          ) : (
            children?.map((child) => (
              <LazyLocationNode key={child.locationId} location={child} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   COMPONENT: MINI STOCK ROW INSIDE A BIN
   ========================================== */
function BinStockMiniRow({ stock, onRefresh }: { stock: WarehouseStock; onRefresh: () => void }) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [delta, setDelta] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const v = await getVariantById(stock.variantId);
        setVariant(v);
      } catch (e) {
        console.error(e);
      }
    };
    fetchVariant();
  }, [stock.variantId]);

  const handleUpdate = async () => {
    if (delta === 0) {
      toast.error("Enter a non-zero adjustment value.");
      return;
    }
    setSubmitting(true);
    try {
      await updateStock(stock.warehouseStockId || stock.stockId!, delta);
      toast.success(`Stock ${delta > 0 ? "increased" : "decreased"} by ${Math.abs(delta)} unit(s)!`);
      setIsEditing(false);
      setDelta(0);
      onRefresh();
    } catch (e) {
      toast.error("Failed to update stock");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this stock record?")) return;
    setSubmitting(true);
    try {
      await deleteStock(stock.warehouseStockId || stock.stockId!);
      toast.success("Stock record removed.");
      onRefresh();
    } catch (e) {
      toast.error("Failed to delete stock record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isTransferOpen && (
        <TransferStockDialog
          stock={stock}
          onClose={() => setIsTransferOpen(false)}
          onSuccess={() => { setIsTransferOpen(false); onRefresh(); }}
        />
      )}
      <div className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-background text-[11px] hover:border-primary/20 transition-all hover:shadow-2xs">
        <div className="min-w-0 flex-1 pr-2">
          <p className="font-bold text-foreground truncate">{variant?.name || "Loading variant details..."}</p>
          <p className="text-[9px] text-muted-foreground font-mono mt-0.5">SKU: {variant?.sku || "..."}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground">Current: <span className="font-bold text-foreground">{stock.totalQuantity}</span></p>
                <p className="text-[9px] text-muted-foreground">After: <span className={`font-bold ${stock.totalQuantity + delta < 0 ? "text-rose-500" : "text-emerald-500"}`}>{stock.totalQuantity + delta}</span></p>
              </div>
              <Input
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                className="h-7.5 w-16 text-center text-[10px] font-semibold"
                placeholder="±0"
              />
              <Button size="xs" onClick={handleUpdate} disabled={submitting || delta === 0} className="h-7 px-2 font-bold text-[10px]">
                Apply
              </Button>
              <Button size="xs" variant="outline" onClick={() => { setIsEditing(false); setDelta(0); }} className="h-7 px-2 text-[10px]">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <span className="font-mono font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded text-[10px]">
                {stock.totalQuantity} unit(s)
              </span>
              <div className="flex items-center gap-1.5 border-l pl-2">
                <button
                  onClick={() => { setIsEditing(true); setDelta(0); }}
                  className="text-muted-foreground hover:text-primary p-1 focus:outline-none transition-colors"
                  disabled={submitting}
                  title="Adjust quantity"
                >
                  <Edit3 size={11} />
                </button>
                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="text-muted-foreground hover:text-amber-500 p-1 focus:outline-none transition-colors"
                  disabled={submitting}
                  title="Transfer to another bin"
                >
                  <ArrowRightLeft size={11} />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-muted-foreground hover:text-rose-500 p-1 focus:outline-none transition-colors"
                  disabled={submitting}
                  title="Delete stock record"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ==========================================
   COMPONENT: ROW IN THE VARIANT FINDER TABLE
   ========================================== */
function VariantStockRow({ stock, onRefresh }: { stock: WarehouseStock; onRefresh: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [delta, setDelta] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [locationDetails, setLocationDetails] = useState<Location | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const locId = stock.warehouseLocationId || stock.locationId;
      if (!locId) return;
      try {
        const res = await getLocationById(locId);
        setLocationDetails(res);
      } catch (e) {
        console.error("Failed to load location details for stock", e);
      }
    };
    fetchLocation();
  }, [stock.locationId, stock.warehouseLocationId]);

  const handleUpdate = async () => {
    if (delta === 0) {
      toast.error("Enter a non-zero adjustment value.");
      return;
    }
    setSubmitting(true);
    try {
      await updateStock(stock.warehouseStockId || stock.stockId!, delta);
      toast.success(`Stock ${delta > 0 ? "increased" : "decreased"} by ${Math.abs(delta)} unit(s)!`);
      setIsEditing(false);
      setDelta(0);
      onRefresh();
    } catch (e) {
      toast.error("Failed to update stock");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this stock record?")) return;
    setSubmitting(true);
    try {
      await deleteStock(stock.warehouseStockId || stock.stockId!);
      toast.success("Stock record removed.");
      onRefresh();
    } catch (e) {
      toast.error("Failed to delete stock record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/10 text-foreground font-medium text-xs">
        <td className="p-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary shrink-0" />
            <span className="font-semibold">{locationDetails?.locationName || locationDetails?.code || "Loading Bin..."}</span>
            <span className="font-mono bg-muted/65 px-1.5 py-0.25 rounded text-[9px] text-muted-foreground ml-1.5">
              {locationDetails?.code || "..."}
            </span>
          </div>
        </td>
        <td className="p-4 font-semibold text-muted-foreground uppercase text-[10px]">
          {locationDetails?.locationType || "BIN"}
        </td>
        <td className="p-4 text-right font-mono font-bold text-foreground">
          {isEditing ? (
            <div className="inline-flex items-center gap-2">
              <div className="text-right text-[9px] text-muted-foreground leading-tight">
                <p>Now: <span className="font-bold text-foreground">{stock.totalQuantity}</span></p>
                <p>After: <span className={`font-bold ${stock.totalQuantity + delta < 0 ? "text-rose-500" : "text-emerald-500"}`}>{stock.totalQuantity + delta}</span></p>
              </div>
              <Input
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                className="h-7.5 w-16 text-center text-xs font-semibold"
                placeholder="±0"
              />
              <Button size="xs" onClick={handleUpdate} disabled={submitting || delta === 0}>Apply</Button>
              <Button size="xs" variant="outline" onClick={() => { setIsEditing(false); setDelta(0); }}>Cancel</Button>
            </div>
          ) : (
            <span>{stock.totalQuantity} units</span>
          )}
        </td>
        <td className="p-4 text-right shrink-0">
          {!isEditing && (
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => { setIsEditing(true); setDelta(0); }}
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                disabled={submitting}
                title="Adjust quantity"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => setIsTransferOpen(true)}
                className="text-muted-foreground hover:text-amber-500 transition-colors focus:outline-none"
                disabled={submitting}
                title="Transfer to another bin"
              >
                <ArrowRightLeft size={13} />
              </button>
              <button
                onClick={handleDelete}
                className="text-muted-foreground hover:text-rose-500 transition-colors focus:outline-none"
                disabled={submitting}
                title="Delete stock record"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </td>
      </tr>
      {isTransferOpen && (
        <tr>
          <td colSpan={4} className="p-0">
            <div className="px-4 pb-2">
              <TransferStockDialog
                stock={stock}
                onClose={() => setIsTransferOpen(false)}
                onSuccess={() => { setIsTransferOpen(false); onRefresh(); }}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}


/* ==========================================
   COMPONENT: TRANSFER STOCK DIALOG
   ========================================== */
function TransferStockDialog({
  stock,
  onClose,
  onSuccess,
}: {
  stock: WarehouseStock;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [targetWarehouseId, setTargetWarehouseId] = useState("");
  const [targetBins, setTargetBins] = useState<Location[]>([]);
  const [targetBinId, setTargetBinId] = useState("");
  const [transferQty, setTransferQty] = useState(1);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [loadingBins, setLoadingBins] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load all warehouses on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getWarehouses(0, 100);
        setWarehouses(res.content);
      } catch (e) {
        toast.error("Failed to load warehouses");
      } finally {
        setLoadingWarehouses(false);
      }
    };
    fetch();
  }, []);

  // Load bins recursively for selected target warehouse
  useEffect(() => {
    if (!targetWarehouseId) {
      setTargetBins([]);
      setTargetBinId("");
      return;
    }
    const loadBins = async () => {
      setLoadingBins(true);
      try {
        const rootLocs = await getRootLocations(targetWarehouseId);
        const bins: Location[] = [];
        const recurse = async (locs: Location[]) => {
          for (const loc of locs) {
            if (loc.locationType === "BIN") {
              bins.push(loc);
            } else {
              const children = await getChildLocations(loc.locationId);
              await recurse(children);
            }
          }
        };
        await recurse(rootLocs);
        setTargetBins(bins);
        setTargetBinId("");
      } catch (e) {
        toast.error("Failed to load target bins");
      } finally {
        setLoadingBins(false);
      }
    };
    loadBins();
  }, [targetWarehouseId]);

  const handleTransfer = async () => {
    if (!targetWarehouseId || !targetBinId || transferQty <= 0) {
      toast.error("Please fill all transfer fields.");
      return;
    }
    if (transferQty > stock.totalQuantity) {
      toast.error(`Cannot transfer more than available stock (${stock.totalQuantity} units).`);
      return;
    }
    const sourceId = stock.warehouseStockId || stock.stockId!;
    setSubmitting(true);
    try {
      // Step 1: Deduct from source
      await updateStock(sourceId, -transferQty);

      // Step 2: Check if target bin already has stock for this variant
      const existingRes = await getStocksByLocation(targetBinId, 0, 100);
      const existing = existingRes.content.find(
        (s: WarehouseStock) => s.variantId === stock.variantId
      );

      if (existing) {
        // Increment existing stock record
        const existId = existing.warehouseStockId || existing.stockId!;
        await updateStock(existId, transferQty);
      } else {
        // Create new stock record in target bin
        await addStock({
          warehouseId: targetWarehouseId,
          variantId: stock.variantId,
          locationId: targetBinId,
          warehouseLocationId: targetBinId,
          totalQuantity: transferQty,
        });
      }

      toast.success(`${transferQty} unit(s) transferred successfully!`);
      onSuccess();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Transfer failed. Please try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="border-b pb-3.5">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ArrowRightLeft className="text-amber-500 h-5 w-5" />
            Transfer Stock
          </DialogTitle>
          <p className="text-[10px] text-muted-foreground mt-1">
            Move units from this bin to any other bin — same or different warehouse.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Source info */}
          <div className="rounded-lg border bg-muted/25 p-3 text-[11px] space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Source</p>
            <p className="font-bold text-foreground">Current Stock: <span className="text-primary">{stock.totalQuantity} unit(s)</span></p>
          </div>

          {/* Target Warehouse */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <WarehouseIcon size={11} className="text-primary" />
              Target Warehouse
            </label>
            {loadingWarehouses ? (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground py-2">
                <Loader2 size={12} className="animate-spin" /> Loading warehouses...
              </div>
            ) : (
              <Select
                value={targetWarehouseId}
                onValueChange={setTargetWarehouseId}
              >
                <SelectTrigger className="w-full h-9 rounded-md bg-background text-foreground text-xs font-medium cursor-pointer">
                  <SelectValue placeholder="-- Select Target Warehouse --" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.warehouseId} value={w.warehouseId}>
                      {w.name} ({w.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Target Bin */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={11} className="text-primary" />
              Target Bin Location
            </label>
            {loadingBins ? (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground py-2">
                <Loader2 size={12} className="animate-spin" /> Loading bins...
              </div>
            ) : (
              <Select
                value={targetBinId}
                onValueChange={setTargetBinId}
                disabled={!targetWarehouseId || targetBins.length === 0}
              >
                <SelectTrigger className="w-full h-9 rounded-md bg-background text-foreground text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder={targetWarehouseId ? (targetBins.length === 0 ? "No locations available" : "-- Select Location --") : "Select a warehouse first"} />
                </SelectTrigger>
                <SelectContent>
                  {targetBins
                    .filter((b) => {
                      const sourceLocId = stock.warehouseLocationId || stock.locationId;
                      return b.locationId !== sourceLocId;
                    })
                    .map((b) => (
                    <SelectItem key={b.locationId} value={b.locationId}>
                      {b.locationName || b.code} ({b.locationType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Units to Transfer</label>
            <Input
              type="number"
              min={1}
              max={stock.totalQuantity}
              value={transferQty}
              onChange={(e) => setTransferQty(Number(e.target.value))}
              className="h-9 text-xs font-semibold"
            />
            <p className="text-[9px] text-muted-foreground">Max transferable: <span className="font-bold text-foreground">{stock.totalQuantity}</span> unit(s)</p>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleTransfer}
            disabled={submitting || !targetWarehouseId || !targetBinId || transferQty <= 0}
          >
            {submitting ? (
              <><Loader2 size={13} className="animate-spin" /> Transferring...</>
            ) : (
              <><ArrowRightLeft size={13} /> Transfer Stock</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WarehouseStockPage;
