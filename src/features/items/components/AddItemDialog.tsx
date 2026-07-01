import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from 'react';
import type { ItemFormData } from '../schema/itemSchema';
import ItemForm from "./ItemForm";

function AddItemDialog(props: {
  handleAddItem: (newItem: ItemFormData) => void;
}) {

    const [open, setOpen] = useState(false);
      const onSubmit = (data: ItemFormData) => {
        props.handleAddItem(data);
        setOpen(false);
      };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Item</DialogTitle>
        </DialogHeader>
        <ItemForm onSubmit={onSubmit} submitText="Add Item" />
      </DialogContent>
    </Dialog>
  );
}

export default AddItemDialog