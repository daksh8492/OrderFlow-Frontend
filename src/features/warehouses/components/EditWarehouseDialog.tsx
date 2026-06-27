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
import { Pencil } from "lucide-react";
import WarehouseForm from "./WarehouseForm";
import type { Warehouse } from "../types/warehouse";

function EditWarehouseDialog(props: {
  onSubmit: (data: WarehouseFormData, warehouseId: string) => void;
  warehouse: Warehouse;
}) {
  const [open, setOpen] = useState(false);

  const { warehouse } = props;

  const onSubmit = (data: WarehouseFormData) => {
    props.onSubmit(data, warehouse.warehouseId);
    setOpen(false);
  };

  const warehouseForm: WarehouseFormData = {
    city: warehouse.city,
    name: warehouse.name,
    address: warehouse.address,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add User</DialogTitle>
        </DialogHeader>
        <WarehouseForm
          defaultValues={warehouseForm}
          onSubmit={onSubmit}
          submitText="Add Warehouse"
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditWarehouseDialog;
