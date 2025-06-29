import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { INotification } from "@/interfaces/INotification";
import echo from "@/lib/echo";
import { useAuth } from "@/hooks/useAuth";
import {
  getNotifications,
  markNotificationRead,
} from "@/services/notification.service";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";
import { NotificationAlert } from "./NotificationAlert";
import { getPriorityColor, getStatusColor } from "@/utils/colors";
import { useNavigate } from "react-router-dom";

export const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const navigate = useNavigate();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["notifications", page, perPage, user?.id],
    queryFn: () => getNotifications({ page, perPage, status: "all" }),
    enabled: !!user?.id,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllNotifications(data.data);
      } else {
        setAllNotifications((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.data.length === perPage);
    }
  }, [data, page, perPage]);

  useEffect(() => {
    if (user?.id) {
      if (user?.role === "agent") {
        const departmentChannel = echo.private(
          `department.${user.department_id}`
        );

        departmentChannel.listen(".new-ticket", (event: INotification) => {
          const notificationData =
            typeof event === "string" ? JSON.parse(event) : event;
          NotificationAlert({
            notification: notificationData,
            role: user?.role,
          });
          refetch();
        });
      }

      const userChannel = echo.private(`App.Models.User.${user.id}`);

      if (user?.role === "client") {
        userChannel.listen(".ticket-updated", (event: INotification) => {
          const notificationData =
            typeof event === "string" ? JSON.parse(event) : event;
          NotificationAlert({
            notification: notificationData,
            role: user?.role,
          });
          refetch();
        });
      }
      // userChannel.listen(".new-response", (event: INotification) => {
      //   const notificationData =
      //     typeof event === "string" ? JSON.parse(event) : event;
      //   NotificationAlert({
      //     notification: notificationData,
      //     role: user?.role,
      //     navigate,
      //   });
      //   refetch();
      // });
      return () => {
        echo.leave(`department.${user.id}`);
        echo.leave(`App.Models.User.${user.id}`);
      };
    }
  }, [user, refetch]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      refetch();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof Object) {
        toast.error(String((error as { name?: string }).name));
      } else toast.error("Something went wrong");
    }
  };

  const loadMoreNotifications = async () => {
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    setIsLoadingMore(false);
  };

  const notifications = allNotifications || [];
  const unreadCount = data?.unread_count || 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 shadow-sm border-none"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[600px] overflow-y-auto ">
          {isLoading ? (
            <div className=" flex justify-center text-center py-4 text-muted-foreground">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No notifications
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => {
                    if (notification.read_at === null) {
                      markAsRead(notification.id);
                    }

                    navigate(
                      `/${user?.role}/tickets/${notification.ticket?.id}`
                    );
                  }}
                  className={`flex flex-col items-start p-3 gap-1 cursor-pointer ${
                    !notification.read_at ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="w-full flex justify-between">
                    <span className="font-medium text-sm">
                      {notification.ticket?.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="w-full flex justify-between items-center mt-1">
                    <span
                      className={`uppercase text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                        notification.ticket?.priority || ""
                      )}`}
                    >
                      {notification.ticket?.priority || ""}
                    </span>
                    <span
                      className={`uppercase text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        notification.ticket?.status || ""
                      )}`}
                    >
                      {notification.ticket?.status?.replace("_", " ")}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              {hasMore && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMoreNotifications}
                    disabled={isLoadingMore}
                    className="w-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="animate-spin w-4 h-4 mr-1" />
                    ) : null}
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
