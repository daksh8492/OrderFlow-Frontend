import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router";

function AppLayout() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
