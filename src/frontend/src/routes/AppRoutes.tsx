import { Routes, Route } from "react-router-dom";

import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import GuestRoute from "./roleRoutes/GuestRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

    </Routes>
  );
}
