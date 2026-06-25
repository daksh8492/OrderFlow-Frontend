import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { UserFormData } from "../schema/userSchema";
import { useState } from "react";
import UserForm from "./UserForm";

function AddUserForm(props: {
  handleAddUser: (newUser: UserFormData) => void;
}) {
  const [open, setOpen] = useState(false);

  const onSubmit = (data: UserFormData) => {
    props.handleAddUser(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Add User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={onSubmit} submitText="Add User" />
      </DialogContent>
    </Dialog>
  );
}

export default AddUserForm;
