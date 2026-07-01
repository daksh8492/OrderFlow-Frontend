import EditVariantDialog from "./EditVariantDialog";
import type { VariantFormData } from "../../schema/variantSchema";
import type { Variant } from "../../types/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, Replace, Trash2Icon } from "lucide-react";
import { useState } from "react";
import EditVariantStatusDialog from "./EditVariantStatusDialog";
import DeleteVariantDialog from "./DeleteVariantDialog";

function VariantOptions(props: {
  selectedVariant: Variant;
  handleUpdateVariant: (variantId: string, data: VariantFormData) => void;
  handleDeleteVariant: (variantId: string) => void;
  handleActivateVariant: (variantId: string) => void;
  handleDeactivateVariant: (variantId: string) => void;
  handleDiscontinueVariant: (variantId: string) => void;
}) {
  const {
    selectedVariant,
    handleUpdateVariant,
    handleDeleteVariant,
    handleActivateVariant,
    handleDeactivateVariant,
    handleDiscontinueVariant,
  } = props;

  const [editDialog, setEditDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditDialog(true)}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusDialog(true)}>
            <Replace/> Status
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2Icon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVariantDialog
        defaultValues={selectedVariant as VariantFormData}
        handleEditVariant={(data: VariantFormData) =>
          handleUpdateVariant(selectedVariant.variantId, data)
        }
        open={editDialog}
        setOpen={setEditDialog}
      />
      <EditVariantStatusDialog
        open={statusDialog}
        setOpen={setStatusDialog}
        curStatus={selectedVariant.status}
        handleActivateVariant={() =>
          handleActivateVariant(selectedVariant.variantId)
        }
        handleDeactivateVariant={() =>
          handleDeactivateVariant(selectedVariant.variantId)
        }
        handleDiscontinueVariant={() =>
          handleDiscontinueVariant(selectedVariant.variantId)
        }
      />
      <DeleteVariantDialog
        handleDeleteVariant={() =>
          handleDeleteVariant(selectedVariant.variantId)
        }
        open={deleteDialog}
        setOpen={setDeleteDialog}
      />
    </div>
  );
}

export default VariantOptions;
