import { lazy } from "react";

export const AdminRoutes = [
  {
    path: "dashboard",
    component: lazy(() => import("@/pages/admin/Dashboard")),
  },
  {
    path: "departments",
    component: lazy(() => import("@/pages/admin/Department")),
  },
  {
    path: "agents",
    component: lazy(() => import("@/pages/admin/Agent")),
  },
  {
    path: "tickets",
    component: lazy(() => import("@/pages/admin/Ticket")),
  },
  {
    path: "tickets/:id",
    component: lazy(() => import("@/pages/admin/ViewTicket")),
  },
   {
    path: "profile",
    component: lazy(() => import("@/pages/Profile")),
  },
];

export const ClientRoutes = [
  {
    path: "dashboard",
    component: lazy(() => import("@/pages/client/Dashboard")),
  },
  {
    path: "tickets",
    component: lazy(() => import("@/pages/client/Ticket")),
  },
  {
    path: "tickets/add",
    component: lazy(() => import("@/pages/client/AddTicket")),
  },
  {
    path: "tickets/:id",
    component: lazy(() => import("@/pages/client/EditTicket")),
  },
   {
    path: "profile",
    component: lazy(() => import("@/pages/Profile")),
  },
];

export const AgentRoutes = [
  {
    path: "dashboard",
    component: lazy(() => import("@/pages/agent/Dashboard")),
  },
  {
    path: "tickets",
    component: lazy(() => import("@/pages/agent/OpenedTicket")),
  },
  {
    path: "assigned",
    component: lazy(() => import("@/pages/agent/AssignedTicket")),
  },
  {
    path: "tickets/:id",
    component: lazy(() => import("@/pages/agent/ViewTicket")),
  },
  {
    path: "profile",
    component: lazy(() => import("@/pages/Profile")),
  },
];
