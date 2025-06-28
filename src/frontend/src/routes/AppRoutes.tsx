import { Routes, Route } from "react-router-dom";

import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import GuestRoute from "./protection/GuestRoutes";
import { ProtectedRoute } from "./protection/ProtectedRoute";
import { AdminRoutes, AgentRoutes, ClientRoutes } from "./PagesRoutes";
import { Suspense } from "react";
import { PageLoader } from "@/components/ui/pageLoader";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { AgentLayout } from "@/layouts/AgentLayout";
import { Logout } from "@/pages/auth/Logout";

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            {AdminRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </Route>
        <Route path="client" element={<ProtectedRoute role="client" />}>
          <Route element={<ClientLayout />}>
            {ClientRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </Route>
        <Route path="agent" element={<ProtectedRoute role="agent" />}>
          <Route element={<AgentLayout />}>
            {AgentRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
