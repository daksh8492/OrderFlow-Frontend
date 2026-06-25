import {
  createColumnHelper,
} from "@tanstack/react-table";
import type { User } from "../types/user";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Trash2Icon,
} from "lucide-react";
import EditUserDialog from "./EditUserDialog";
import type { UserFormData } from "../schema/userSchema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Table from "@/components/common/Table";

function UsersTable(props: {
  users: User[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  handleEditUser: (userId: string, user: UserFormData) => void;
  handleDeactivateUser: (userId: string) => void;
  handleActivateUser: (usereId: string) => void;
  handleJoinUser: (userId: string) => void;
  handleDeleteUser: (userId: string) => void;
}) {
  
  const {
    users,
    page,
    size,
    totalPages,
    totalElements,
    onPageChange,
    onSizeChange,
    handleEditUser,
    handleDeactivateUser,
    handleActivateUser,
    handleJoinUser,
    handleDeleteUser,
  } = props;
  
  const columnHelper = createColumnHelper<User>();
  
  const columns = [
    columnHelper.accessor("code", {
      header: "Code",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("fieldOfWork", {
      header: "Role",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("city", {
      header: "City",
      cell: (info) => info.getValue() ?? "-",
    }),

    columnHelper.accessor("active", {
      header: "Status",
      cell: (info) =>
        info.getValue() ? (
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="rounded-full border px-3 py-1 text-xs font-medium">
            Inactive
          </span>
        ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const user = row.row.original;
        return (
          <div className="flex gap-1">
            <EditUserDialog user={user} handleEditUser={handleEditUser} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    user.active
                      ? handleDeactivateUser(user.userId)
                      : handleActivateUser(user.userId)
                  }
                >
                  {user.active ? <>Deactivate</> : <>Activate</>}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.userId)}
                >
                  <Trash2Icon /> Delete
                </DropdownMenuItem>
                {user.joinedAt == null ? (
                  <DropdownMenuItem onClick={() => handleJoinUser(user.userId)}>
                    Join
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  return (
    <Table
      columns={columns}
      data={users}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      page={page}
      size={size}
      totalElements={totalElements}
      totalPages={totalPages}
    />
  );
}

export default UsersTable;
