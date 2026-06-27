import { useState } from "react";
import type { WarehouseFormData } from "../schema/warehouseSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WarehouseForm from "./WarehouseForm";

function AddWarehouseDialog(props: {
  handleAddWarehouse: (data: WarehouseFormData) => void;
}) {
  const [open, setOpen] = useState(false);

  const onSubmit = (data: WarehouseFormData) => {
    props.handleAddWarehouse(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Warehouse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add User</DialogTitle>
        </DialogHeader>
        <WarehouseForm onSubmit={onSubmit} submitText="Add Warehouse" />
      </DialogContent>
    </Dialog>
  );
}

export default AddWarehouseDialog;
