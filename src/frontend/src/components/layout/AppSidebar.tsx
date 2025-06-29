import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { IMenuItem } from "@/interfaces/IMenuItem";
import { Button } from "../ui/button";

export const AppSidebar = ({ items }: { items: IMenuItem[] }) => {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <Sidebar className="border-none ">
      <SidebarHeader className="p-6">
        <div className="text-center">
          <h1 className="text-2xl uppercase font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TicketFlow
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
            TICKET ISSUE MANAGEMENT
          </p>
        </div>
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
      <SidebarFooter className="p-4">
        <Button 
          variant={"outline"} 
          onClick={() => navigate("/logout")}
          className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
        >
          Logout
        </Button>
        <div className="text-xs text-center text-gray-400 mt-3 border-t pt-3">
          <span className="font-medium">&copy; {new Date().getFullYear()}</span>
          <br />
          <span className="text-blue-500 font-semibold">TicketFlow</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
