import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VariantFormData } from "../../schema/variantSchema";
import VariantForm from "./VariantForm";
function EditVariantDialog(props: {
  handleEditVariant: (data: VariantFormData) => void;
  defaultValues: VariantFormData;
  open: boolean;
  setOpen: (data: boolean) => void;
}) {

  const {open, setOpen} = props;

  const onSubmit = (data: VariantFormData) => {
    props.handleEditVariant(data);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Variant</DialogTitle>
        </DialogHeader>
        <VariantForm defaultValues={props.defaultValues} onSubmit={onSubmit} submitText="Edit Variant" />
      </DialogContent>
    </Dialog>
  )
}

export default EditVariantDialog