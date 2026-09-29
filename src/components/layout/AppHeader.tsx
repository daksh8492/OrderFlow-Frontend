import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Slash,
  Palette,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { useTheme } from "../theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";

import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/services/authService";
import { logoutSuccess } from "@/store/authSlice";

const BREADCRUMB_MAP: Record<string, string[]> = {
  "/app/dashboard": ["Dashboard"],
  "/app/users": ["Users"],
  "/app/warehouses": ["Warehouse", "Warehouses"],
  "/app/locations": ["Warehouse", "Locations"],
  "/app/warehouse-stock": ["Warehouse", "Stock"],
  "/app/items": ["Catalog", "Items"],
  "/app/customers": ["Catalog", "Customers"],
  "/app/vendors": ["Catalog", "Vendors"],
  "/app/orders/add": ["Orders", "Create Order"],
  "/app/orders/fulfillment": ["Orders", "Fulfillment"],
  "/app/orders/picking": ["Picking"],
  "/app/profile": ["Profile"],
};

function getBreadcrumb(pathname: string): string[] {
  // Exact match first
  if (BREADCRUMB_MAP[pathname]) return BREADCRUMB_MAP[pathname];
  // Prefix match (for detail pages)
  if (pathname.startsWith("/app/items/")) return ["Catalog", "Item Details"];
  if (pathname.startsWith("/app/orders/")) return ["Orders", "Order Details"];
  if (pathname.startsWith("/app/orders")) return ["Orders"];
  return ["Dashboard"];
}

function AppHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { setTheme } = useTheme();

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
      ?.split(" ")
      .filter(Boolean)
      .map((x) => x[0])
      .join("")
      .toUpperCase() ?? "U";

  const crumbs = getBreadcrumb(location.pathname);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b bg-background/98 px-5 backdrop-blur-sm">
      {/* ── Left: Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <Slash className="h-3 w-3 text-muted-foreground/50 rotate-[-20deg]" />}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground text-xs font-medium"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* ── Right: User dropdown ── */}
      <div className="flex items-center gap-2">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-xl border bg-background px-2.5 py-1.5 text-left transition-all duration-150 hover:bg-accent hover:shadow-sm focus:outline-none"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[120px] truncate text-[12px] font-semibold leading-none">{user?.name}</p>
              <p className="max-w-[120px] truncate text-[10px] text-muted-foreground leading-none mt-0.5">
                {user?.fieldOfWork}
              </p>
            </div>

            {open ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-52 rounded-xl p-1">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-3 py-2.5">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold">{user?.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{user?.fieldOfWork}</p>
                </div>
              </div>
            </DropdownMenuLabel>

            <div className="my-1 h-px bg-border/60 mx-1" />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer rounded-lg py-2 text-[13px]">
                <Palette className="mr-2 h-3.5 w-3.5" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-xl min-w-[130px] p-1">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer rounded-lg py-2 text-[12px]">
                    <Sun className="mr-2 h-3.5 w-3.5" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer rounded-lg py-2 text-[12px]">
                    <Moon className="mr-2 h-3.5 w-3.5" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer rounded-lg py-2 text-[12px]">
                    <Laptop className="mr-2 h-3.5 w-3.5" /> System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              onClick={() => navigate("/app/profile")}
              className="cursor-pointer rounded-lg py-2 text-[13px]"
            >
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
              className="cursor-pointer rounded-lg py-2 text-[13px]"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  );
}

export default AppHeader;