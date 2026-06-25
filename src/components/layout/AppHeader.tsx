import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, ChevronUp, Trash, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "@/services/authService";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logoutSuccess } from "@/store/authSlice";

function AppHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      dispatch(logoutSuccess());
      navigate("/login");
    }
  };

  const initials =
    user?.name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs">{user?.fieldOfWork}</p>
            </div>
            {open ? <ChevronUp /> : <ChevronDown />}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Accounts</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate("/app/profile")}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <Trash /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AppHeader;
