import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { IMenuItem } from "@/interfaces/IMenuItem";
import { Outlet } from "react-router-dom";

export const MainLayout = ({ navData }: { navData: IMenuItem[] }) => {
  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar items={navData} />

        <div className="w-full flex flex-col  bg-gradient-to-tr from-blue-50 to-purple-50">
          <TopBar />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
};
