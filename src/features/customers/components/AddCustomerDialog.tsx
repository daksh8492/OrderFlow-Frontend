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
import type { CustomerFormData } from "../schema/customerSchema";
import CustomerForm from "./CustomerForm";

function AddCustomerDialog(props: {
  handleAddCustomer: (data: CustomerFormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const onSubmit = (data: CustomerFormData) => {
    props.handleAddCustomer(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Customer</DialogTitle>
        </DialogHeader>
        <CustomerForm onSubmit={onSubmit} submitText="Add Customer" />
      </DialogContent>
    </Dialog>
  );
}

export default AddCustomerDialog;
