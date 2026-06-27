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
import { WAREHOUSE_STATUS, type WarehouseStatus } from "../types/warehouse";
import { useState } from "react";

function EditWarehouseStatusDialog(props: {
  open: boolean;
  setOpen: (data: boolean) => void;
  curStatus: WarehouseStatus;
  handleUpdateWarehouseStatus: (status: WarehouseStatus) => void;
}) {
  const { open, setOpen, curStatus, handleUpdateWarehouseStatus } = props;

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
              onValueChange={(val) => setStatus(val as WarehouseStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {WAREHOUSE_STATUS.map((stat) => (
                    <SelectItem value={stat} key={stat}>
                      {stat}
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
              handleUpdateWarehouseStatus(status);
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

export default EditWarehouseStatusDialog;
