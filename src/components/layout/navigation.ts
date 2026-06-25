import type { NavItem } from "@/types/navItems";
import { LayoutDashboard, ShoppingCart, Users, Warehouse } from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
    {
    title: "Dashboard",
    path: "/app/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
  },
  {
    title: "Users",
    path: "/app/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Warehouses",
    path: "/app/warehouses",
    icon: Warehouse,
    roles: ["ADMIN","INVENTORY_MANAGER"],
  },
  {
    title: "Items",
    path: "/app/items",
    icon: ShoppingCart,
    roles: ["ADMIN", "INVENTORY_MANAGER"],
  },
]