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
            <Route path="warehouses/*" element={<WarehousesPage/>}/>
            <Route path="locations/*" element={<LocationPage/>}/>
            <Route path="items/*" element={<ItemPage/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
