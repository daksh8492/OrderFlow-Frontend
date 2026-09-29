import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoutes from "./ProtectedRoutes";
import LandingPage from "@/pages/LandingPage";
import UserPage from "@/features/users/pages/UsersPage";
import WarehousesPage from "@/features/warehouses/pages/WarehousesPage";
import ItemPage from "@/features/items/pages/ItemPage";
import LocationPage from "@/features/locations/pages/LocationPage";
import ItemDetailPage from "@/features/items/pages/ItemDetailPage";
import CustomerPage from "@/features/customers/pages/CustomerPage";
import VendorsPage from "@/features/vendors/pages/VendorsPage";
import OrderPage from "@/features/orders/pages/OrderPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import AddOrderPage from "@/features/orders/pages/AddOrderPage";
import FulfillmentPage from "@/features/orders/pages/FulfillmentPage";
import PickingPage from "@/features/orders/pages/PickingPage";
import WarehouseStockPage from "@/features/warehouse-stock/pages/WarehouseStockPage";
import PackingPage from "@/features/packing/pages/PackingPage";
import ShipmentPage from "@/features/shipments/pages/ShipmentPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users/*" element={<UserPage />} />
            <Route path="warehouses/*" element={<WarehousesPage />} />
            <Route path="locations/*" element={<LocationPage />} />
            <Route path="items" element={<ItemPage />} />
            <Route path="items/:id" element={<ItemDetailPage />} />
            <Route path="customers/*" element={<CustomerPage />} />
            <Route path="vendors/*" element={<VendorsPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="orders/add" element={<AddOrderPage />} />
            <Route path="orders/fulfillment" element={<FulfillmentPage />} />
            <Route path="orders/picking" element={<PickingPage />} />
            <Route path="packing" element={<PackingPage />} />
            <Route path="shipments" element={<ShipmentPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="warehouse-stock" element={<WarehouseStockPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
