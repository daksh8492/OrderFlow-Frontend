import type { NavItem } from "@/types/navItems";
import {
  Handshake,
  LayoutDashboard,
  LocationEdit,
  Package,
  ShoppingBag,
  ShoppingCart,
  UserCog,
  Warehouse,
  ClipboardList,
  Truck,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    path: "/app/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
  },

  {
    title: "Warehouse",
    icon: Warehouse,
    roles: [],
    children: [
      {
        title: "Warehouses",
        path: "/app/warehouses",
        icon: Warehouse,
        roles: ["ADMIN", "INVENTORY_MANAGER"],
      },
      {
        title: "Locations",
        path: "/app/locations",
        icon: LocationEdit,
        roles: ["ADMIN", "INVENTORY_MANAGER"],
      },
      {
        title: "Warehouse Stock",
        path: "/app/warehouse-stock",
        icon: Package,
        roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
      },
    ],
  },

  {
    title: "Catalog",
    icon: ShoppingCart,
    roles: [],
    children: [
      {
        title: "Items",
        path: "/app/items",
        icon: ShoppingCart,
        roles: ["ADMIN", "INVENTORY_MANAGER"],
      },
      {
        title: "Customers",
        path: "/app/customers",
        icon: Handshake,
        roles: ["ADMIN", "INVENTORY_MANAGER"],
      },
      {
        title: "Vendors",
        path: "/app/vendors",
        icon: ShoppingBag,
        roles: ["ADMIN", "INVENTORY_MANAGER"],
      },
    ],
  },

  {
    title: "Orders",
    icon: ClipboardList,
    roles: [],
    children: [
      {
        title: "All Orders",
        path: "/app/orders",
        icon: ClipboardList,
        roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
      },
      {
        title: "Fulfillment",
        path: "/app/orders/fulfillment",
        icon: Truck,
        roles: ["ADMIN", "INVENTORY_MANAGER"],
      },
    ],
  },

  {
    title: "Picking",
    path: "/app/orders/picking",
    icon: Package,
    roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
  },

  {
    title: "Packing",
    path: "/app/packing",
    icon: Package,
    roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
  },

  {
    title: "Shipments",
    path: "/app/shipments",
    icon: Truck,
    roles: ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_OPERATOR"],
  },

  {
    title: "Users",
    path: "/app/users",
    icon: UserCog,
    roles: ["ADMIN"],
  },
];