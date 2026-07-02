import { useState } from "react";
import type { VendorFormData } from "../schema/vendorSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import VendorForm from "./VendorForm";
import type { Vendor } from "../types/vendor";
function EditVendorDialog({
  vendor,
  handleEditVendor,
}: {
  vendor: Vendor;
  handleEditVendor: (vendorId: string, vendor: VendorFormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const onSubmit = (data: VendorFormData) => {
    handleEditVendor(vendor.vendorId, data);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm defaultValues={vendor as VendorFormData} onSubmit={onSubmit} submitText="Edit Vendor" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditVendorDialog;
