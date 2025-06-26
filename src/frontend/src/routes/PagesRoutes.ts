import { lazy } from "react";



export const AdminRoutes = [
    {
        path: "dashboard",
        component: lazy(() => import('@/pages/admin/Dashboard')),
    },
       {
        path: "departments",
        component: lazy(() => import('@/pages/admin/Department')),
    }
]

export const ClientRoutes = [
    {
        path: "dashboard",
        component: lazy(() => import('@/pages/client/Dashboard')),
    },
       {
        path: "departments",
        component: lazy(() => import('@/pages/client/Department')),
    }
]
