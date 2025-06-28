import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
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
        <main className="flex-1">
          <TopBar />
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};
