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
import { Spinner } from "@/components/ui/spinner";
import ItemHeader from "../components/itemDetail/ItemHeader";
import VariantSeletor from "../components/itemDetail/VariantSeletor";
import ImageGallery from "../components/itemDetail/ImageGallery";
import VariantDetails from "../components/itemDetail/VariantDetails";
import SpecificationsCard from "../components/itemDetail/SpecificationsCard";
import AddVariantDialog from "../components/itemDetail/AddVariantDialog";
import type { VariantFormData } from "../schema/variantSchema";
import { toast } from "sonner";

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

  if (loading) {
    return <Spinner />;
  }

  if (item)
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <ItemHeader
          category={item.category}
          itemStatusVariant={itemStatusVariant}
          name={item.name}
          sourceType={item.sourceType}
          status={item.status}
        />

        <AddVariantDialog handleAddVariant={handleAddVariant} />

        {item.variants.length ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Variants
              </h2>
              <VariantSeletor
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                variants={item.variants}
              />
            </div>

            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="grid gap-10 lg:grid-cols-12">
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

            <SpecificationsCard selectedVariant={selectedVariant} />
          </div>
        ) : (
          <div>No variants added please add a variant</div>
        )}
      </div>
    );
}

export default ItemDetailPage;
