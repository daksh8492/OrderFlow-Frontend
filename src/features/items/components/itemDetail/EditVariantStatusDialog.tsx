import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { formatEnum } from "@/utils/format";
import { VARIANT_STATUS, type VariantStatus } from "../../types/item";

function EditVariantStatusDialog(props: {
  open: boolean;
  setOpen: (data: boolean) => void;
  curStatus: VariantStatus;
  handleDeactivateVariant: () => void;
  handleActivateVariant: () => void;
  handleDiscontinueVariant: () => void;
}) {
  const { open, setOpen, curStatus, handleActivateVariant, handleDeactivateVariant, handleDiscontinueVariant } = props;

  const [status, setStatus] = useState(curStatus);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit status</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="status">Select Status</FieldLabel>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as VariantStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {VARIANT_STATUS.map((stat) => (
                    <SelectItem value={stat} key={stat}>
                      {formatEnum(stat)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              console.log(status)
              if(status == "ACTIVE"){
                handleActivateVariant()
              }else if(status == "DISCONTINUED"){
                handleDiscontinueVariant()
              }else{
                handleDeactivateVariant()
              }
              setOpen(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditVariantStatusDialog;
