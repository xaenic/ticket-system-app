import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import GuestRoute from "./protection/GuestRoutes";
import { ProtectedRoute } from "./protection/ProtectedRoute";
import { AdminRoutes, AgentRoutes, ClientRoutes } from "./PagesRoutes";
import { Suspense } from "react";
import { PageLoader } from "@/components/ui/pageLoader";

import { Logout } from "@/pages/auth/Logout";
import { MainLayout } from "@/layouts/MainLayout";
import { adminData, agentData, clientData } from "./navdata";

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Public routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<MainLayout navData={adminData} />}>
            {AdminRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </Route>
        <Route path="client" element={<ProtectedRoute role="client" />}>
          <Route element={<MainLayout navData={clientData} />}>
            {ClientRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </Route>
        <Route path="agent" element={<ProtectedRoute role="agent" />}>
          <Route element={<MainLayout navData={agentData} />}>
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
