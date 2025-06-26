import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import type { IMenuItem } from "@/interfaces/IMenuItem";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";

export const AppSidebar = ({ items }: { items: IMenuItem[] }) => {
  const path = useLocation().pathname;

  const { logout } = useAuth();
  return (
    <Sidebar className="border-none ">
      <SidebarHeader>
        <h1 className="text-xl text-center font-bold text-gray-700">
          Management
        </h1>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link
                  to={`${item.url}`}
                  className={`flex gap-3 hover:bg-gray-100 p-2 rounded-md items-center cursor-pointer duration-200 transition-colors
                    ${
                      path.includes(item.url)
                        ? "bg-blue-100 text-blue-500"
                        : "  text-slate-600 "
                    }`}
                >
                  {item.icon}
                  <span className=" text-sm font-semibold">{item.title}</span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant={"outline"} onClick={logout}>
          Logout
        </Button>
        <div className="text-xs text-center text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Ticket System
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
