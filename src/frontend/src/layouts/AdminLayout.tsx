import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Building2, ChartColumnBigIcon, Ticket, UserPlus, UsersRound } from "lucide-react";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  const navData = [
    {
      title: "Dashboard",
      icon: <ChartColumnBigIcon size={24} />,
      url: "dashboard",
    },
    {
      title: "Departments",
      icon: <Building2 size={22} />,
      url: "clients",
    },

    {
      title: "Agents",
      icon: <UsersRound size={20} />,
      url: "agents",
    },
    {
      title: "Clients",
      icon: <UserPlus size={22} />,
      url: "clients",
    },
    {
      title: "Tickets",
      icon: <Ticket size={24} />,
      url: "tickets",
    },
  ];
  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar items={navData} />
        <Outlet />
      </SidebarProvider>
    </div>
  );
};
