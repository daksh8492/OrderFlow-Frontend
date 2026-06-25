import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { initializeAuth } from "./services/authInitializer";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster richColors/>
    </>
  );
}

export default App;
