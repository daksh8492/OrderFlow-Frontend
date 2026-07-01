import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from 'react';
import type { ItemFormData } from '../schema/itemSchema';
import ItemForm from "./ItemForm";
import type { ItemSummary } from "../types/item";

function EditItemDialog(props: {
  handleEditItem: (userId: string, newUser: ItemFormData) => void;
  item: ItemSummary;
}) {
  const [open, setOpen] = useState(false);
  const {item} = props;
  const onSubmit = (data: ItemFormData) => {
    props.handleEditItem(item.itemId, data);
    setOpen(false);
  };

  const itemForm: ItemFormData = {
    category: item.category,
    name: item.name,
    sourceType: item.sourceType
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Item</DialogTitle>
        </DialogHeader>
        <ItemForm defaultValues={itemForm} onSubmit={onSubmit} submitText="Edit Item" />
      </DialogContent>
    </Dialog>
  );
}
export default EditItemDialog;
