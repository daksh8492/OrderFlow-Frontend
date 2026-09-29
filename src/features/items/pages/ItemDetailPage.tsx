import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { type Item, type Variant } from "../types/item";
import {
  activateVariant,
  addVariant,
  deactivateVariant,
  deleteVariant,
  discontinueVariant,
  getItemById,
  updateVariant,
} from "../api/itemApi";
import ItemHeader from "../components/itemDetail/ItemHeader";
import VariantSeletor from "../components/itemDetail/VariantSeletor";
import ImageGallery from "../components/itemDetail/ImageGallery";
import VariantDetails from "../components/itemDetail/VariantDetails";
import SpecificationsCard from "../components/itemDetail/SpecificationsCard";
import AddVariantDialog from "../components/itemDetail/AddVariantDialog";
import type { VariantFormData } from "../schema/variantSchema";
import { toast } from "sonner";
import { Loader2, Layers } from "lucide-react";

const itemStatusVariant = {
  DRAFT: "warning",
  ACTIVE: "primary",
  INACTIVE: "neutral",
  DISCONTINUED: "error",
} as const;

const variantStatus = {
  OUT_OF_STOCK: "warning",
  ACTIVE: "primary",
  INACTIVE: "neutral",
  DISCONTINUED: "error",
} as const;

function ItemDetailPage() {
  const { id } = useParams();

  const [item, setItem] = useState<Item | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant>();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchItem = async () => {
    try {
      if (!id) navigate("/app/items");
      else {
        setLoading(true);
        const response = await getItemById(id);
        setItem(response);
        setSelectedVariant(response.variants[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error in getting item: ", error);
      navigate("/app/items");
    }
  };

  const handleAddVariant = async (data: VariantFormData) => {
    const payload = {
      ...data,
      attributes: Object.fromEntries(
        data.attributes.map((attr) => [attr.key, attr.value]),
      ),
      itemId: item?.itemId,
    };
    await addVariant(payload);
    fetchItem();
  };

  const handleupdateVariant = async (
    variantId: string,
    data: VariantFormData,
  ) => {
    const payload = {
      ...data,
      attributes: Object.fromEntries(
        data.attributes.map((attr) => [attr.key, attr.value]),
      ),
      itemId: item?.itemId,
    };
    await updateVariant(variantId, payload);
    fetchItem();
  };

  const handleDeleteVariant = async (variantId: string) => {
    await deleteVariant(variantId);
    fetchItem();
  };

  const handleDeactivateVariant = async (id: string) => {
    try {
      await deactivateVariant(id);
      toast.success("Variant successfully deactivated");
      await fetchItem();
    } catch (error) {
      toast.error("Variant could not be deactivated");
      console.error("Variant deactivating error: ", error);
    }
  };

  const handleActivateVariant = async (id: string) => {
    try {
      await activateVariant(id);
      toast.success("Variant successfully activated");
      await fetchItem();
    } catch (error) {
      toast.error("Variant could not be activated");
      console.error("Variant activating error: ", error);
    }
  };

  const handleDiscontinueVariant = async (id: string) => {
    try {
      await discontinueVariant(id);
      toast.success("Variant successfully discontinued");
      await fetchItem();
    } catch (error) {
      toast.error("Variant could not be discontinued");
      console.error("Variant discontinuing error: ", error);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  /* ─── Loading ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ─── Not found ───────────────────────────────────── */
  if (!item) return null;

  /* ─── Main content ────────────────────────────────── */
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-5">
      {/* Item header card with back nav */}
      <ItemHeader
        category={item.category}
        itemStatusVariant={itemStatusVariant}
        name={item.name}
        sourceType={item.sourceType}
        status={item.status}
      />

      {item.variants.length > 0 ? (
        <div className="space-y-4">
          {/* Variant selector card + Add button */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <VariantSeletor
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                variants={item.variants}
              />
            </div>
            <div className="pt-1">
              <AddVariantDialog handleAddVariant={handleAddVariant} />
            </div>
          </div>

          {/* Main variant detail card */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-12">
              <ImageGallery imageUrls={selectedVariant?.imageUrls ?? []} />
              <VariantDetails
                handleUpdateVariant={handleupdateVariant}
                selectedVariant={selectedVariant}
                variantStatus={variantStatus}
                handleDeleteVariant={handleDeleteVariant}
                handleActivateVariant={handleActivateVariant}
                handleDeactivateVariant={handleDeactivateVariant}
                handleDiscontinueVariant={handleDiscontinueVariant}
              />
            </div>
          </div>

          {/* Specifications */}
          <SpecificationsCard selectedVariant={selectedVariant} />
        </div>
      ) : (
        /* Empty state — no variants */
        <div className="rounded-xl border bg-card">
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
              <Layers className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No variants yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                This item has no variants. Add a variant to define SKUs, pricing, and inventory.
              </p>
            </div>
            <AddVariantDialog handleAddVariant={handleAddVariant} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetailPage;
