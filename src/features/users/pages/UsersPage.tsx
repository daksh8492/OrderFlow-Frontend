import { useEffect, useState } from "react";
import { FIELD_OF_WORK, type FieldOfWork, type User } from "../types/user";
import type { PageResponse } from "@/types/pageResponse";
import {
  activateUser,
  createUser,
  deactivateUser,
  deleteUser,
  getUsers,
  getUsersByFieldOfWork,
  joinUser,
  searchUsers,
  updateUser,
} from "../api/userApi";
import UsersTable from "../components/UsersTable";
import AddUserForm from "../components/AddUserDialog";
import type { UserFormData } from "../schema/userSchema";
import { toast } from "sonner";
import TableToolbar from "@/components/common/TableToolbar";

function UserPage() {
  const [usersPage, setUsersPage] = useState<PageResponse<User> | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FieldOfWork>();

  const fetchUsers = async () => {
    let response;
    if (search.trim().length > 0) {
      response = await searchUsers(search, page, size);
    } else if (roleFilter) {
      response = await getUsersByFieldOfWork(
        roleFilter as FieldOfWork,
        page,
        size,
      );
    } else {
      response = await getUsers(page, size);
    }

    setUsersPage(response);
  };

  const handleAddUser = async (newUser: UserFormData) => {
    try {
      const newUserResponse = await createUser(newUser);
      console.log("New user created:", newUserResponse);
      toast.success("User created successfully");
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async (userId: string, user: UserFormData) => {
    try {
      const response = await updateUser(userId, user);
      console.log("User updated:", response);
      toast.success("User updated successfully");
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user: ", error);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await deactivateUser(userId);
      toast.success("User successfully deactivated");
      await fetchUsers();
    } catch (error) {
      toast.error("User could not be deactivated");
      console.error("User deactivating error: ", error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await activateUser(userId);
      toast.success("User successfully activated");
      await fetchUsers();
    } catch (error) {
      toast.error("User could not be activated");
      console.error("User activating error: ", error);
    }
  };

  const handleJoinUser = async (userId: string) => {
    try {
      await joinUser(userId);
      toast.success("User joined successfully");
      await fetchUsers();
    } catch (error) {
      toast.error("Could not join user");
      console.error("Erorr in joining user: ", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      await fetchUsers();
    } catch (error) {
      toast.error("Could not delete user");
      console.error("Error in deleting user: ", error);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchInput(query);
    setRoleFilter(undefined);
    setPage(0);
  };

  const handleRoleChange = (role: FieldOfWork | undefined) => {
    setRoleFilter(role);
    setSearchInput("");
    setPage(0);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size, search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage users and their roles.</p>
      </div>

      <TableToolbar
        search={{
          placeholder: "Search users...",
          value: searchInput,
          onChange: handleSearchChange,
        }}
        filters={[
          {
            placeholder: "Role",
            value: roleFilter,
            onChange: (value) =>
              handleRoleChange(value as FieldOfWork | undefined),
            allLabel: "All",
            options: FIELD_OF_WORK,
          },
        ]}
        actions={<AddUserForm handleAddUser={handleAddUser} />}
      />

      {usersPage ? (
        <UsersTable
          users={usersPage.content}
          totalPages={usersPage.totalPages}
          page={page}
          onPageChange={setPage}
          size={size}
          onSizeChange={setSize}
          totalElements={usersPage.totalElements}
          handleEditUser={handleEditUser}
          handleDeactivateUser={handleDeactivateUser}
          handleActivateUser={handleActivateUser}
          handleJoinUser={handleJoinUser}
          handleDeleteUser={handleDeleteUser}
        />
      ) : (
        <p className="text-muted-foreground">No users found.</p>
      )}
    </div>
  );
}

export default UserPage;
