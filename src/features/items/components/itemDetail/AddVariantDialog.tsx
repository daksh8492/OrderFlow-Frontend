import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { VariantFormData } from "../../schema/variantSchema";
import VariantForm from "./VariantForm";
function AddVariantDialog(props: {
  handleAddVariant: (newUser: VariantFormData) => void;
}) {
  const [open, setOpen] = useState(false);

  const onSubmit = (data: VariantFormData) => {
    props.handleAddVariant(data);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Variant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Variant</DialogTitle>
        </DialogHeader>
        <VariantForm onSubmit={onSubmit} submitText="Add User" />
      </DialogContent>
    </Dialog>
  )
}

export default AddVariantDialog