import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChartColumnBigIcon, Ticket } from "lucide-react";
import { Outlet } from "react-router-dom";

export const AgentLayout = () => {
  const navData = [
    {
      title: "Dashboard",
      icon: <ChartColumnBigIcon size={24} />,
      url: "dashboard",
    },
    {
      title: "Opened Tickets",
      icon: <Ticket size={22} />,
      url: "tickets",
    },

    {
      title: "Assigned Tickets",
      icon: <Ticket size={22} />,
      url: "assigned",
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
