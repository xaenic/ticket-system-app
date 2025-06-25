import { lazy } from "react";



export const AdminRoutes = [
    {
        path: "dashboard",
        component: lazy(() => import('@/pages/admin/Dashboard')),
    }
]
