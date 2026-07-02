import { useState } from 'react'
import type { VendorFormData } from '../schema/vendorSchema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VendorForm from './VendorForm';

function AddVendorDialog({handleAddVendor} : {
    handleAddVendor: (vendor: VendorFormData) => void
}) {
  const [open, setOpen] = useState(false);
  const onSubmit = (data: VendorFormData) => {
    handleAddVendor(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Vendor</DialogTitle>
        </DialogHeader>
        <VendorForm onSubmit={onSubmit} submitText="Add Vendor" />
      </DialogContent>
    </Dialog>
  );
}

export default AddVendorDialog