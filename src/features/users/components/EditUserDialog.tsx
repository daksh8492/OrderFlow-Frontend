import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import type { UserFormData } from "../schema/userSchema";
import { useState } from "react";
import UserForm from "./UserForm";
import type { User } from "../types/user";
import { Button } from "@/components/ui/button";

function EditUserDialog(props: {
  handleEditUser: (userId: string, newUser: UserFormData) => void;
  user: User;
}) {
  const [open, setOpen] = useState(false);

  const onSubmit = (data: UserFormData, userId: string) => {
    props.handleEditUser(userId, data);
    setOpen(false);
  };

  const userForm: UserFormData = {
    name: props.user.name,
    fieldOfWork: props.user.fieldOfWork,
    warehouseId: props.user.warehouseId ?? "",
    address: props.user.address ?? "",
    city: props.user.city ?? "",
    contactNumber: props.user.contactNumber ?? "",
    contactTelephone: props.user.contactTelephone ?? "",
    contactEmail: props.user.contactEmail ?? "",
    salary: props.user.salary ?? undefined,
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
          <DialogTitle className="text-lg">Edit User</DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={userForm}
          onSubmit={(data) => onSubmit(data, props.user.userId)}
          submitText="Edit User"
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;
