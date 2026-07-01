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
import { ITEM_STATUS, type ItemStatus } from "../types/item";
import { useState } from "react";
import { formatEnum } from "@/utils/format";

function EditItemStatusDialog(props: {
  open: boolean;
  setOpen: (data: boolean) => void;
  curStatus: ItemStatus;
  handleDeactivateItem: () => void;
  handleActivateItem: () => void;
  handleDiscontinueItem: () => void;
}) {
  const { open, setOpen, curStatus, handleActivateItem, handleDeactivateItem, handleDiscontinueItem } = props;

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
              onValueChange={(val) => setStatus(val as ItemStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ITEM_STATUS.map((stat) => (
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
              if(status == "ACTIVE"){
                handleActivateItem()
              }else if(status == "DISCONTINUED"){
                handleDiscontinueItem()
              }else{
                handleDeactivateItem()
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

export default EditItemStatusDialog;
