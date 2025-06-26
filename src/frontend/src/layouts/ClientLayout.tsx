import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChartColumnBigIcon, Ticket} from "lucide-react";
import { Outlet } from "react-router-dom";

export const ClientLayout = () => {
  const navData = [
    {
      title: "Dashboard",
      icon: <ChartColumnBigIcon size={24} />,
      url: "dashboard",
    },
    {
      title: "My Tickets",
      icon: <Ticket size={22} />,
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
