import { Routes, Route } from "react-router-dom";

import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import GuestRoute from "./protection/GuestRoutes";
import { ProtectedRoute } from "./protection/ProtectedRoute";
import { AdminRoutes } from "./PagesRoutes";
import { Suspense } from "react";
import { PageLoader } from "@/components/ui/pageLoader";
import { AdminLayout } from "@/layouts/AdminLayout";

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            {AdminRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })} 
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
