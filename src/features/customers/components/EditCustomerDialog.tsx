import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CustomerFormData } from "../schema/customerSchema";
import type { Customer } from "../types/customer";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import CustomerForm from "./CustomerForm";

function EditCustomerDialog(props: {
  handleEditCustomer: (customerId: string, data: CustomerFormData) => void;
  customer: Customer;
}) {
  const { customer, handleEditCustomer } = props;

  const onSubmit = (data: CustomerFormData) => {
    console.log("Submitting data for customerId:", customer.customerId, "with data:", data);
    handleEditCustomer(customer.customerId, data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Item</DialogTitle>
        </DialogHeader>
        <CustomerForm
          defaultValues={customer as CustomerFormData}
          onSubmit={onSubmit}
          submitText="Edit Item"
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditCustomerDialog;
