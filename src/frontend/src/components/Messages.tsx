import { useState, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_API_URL } from "@/utils/api";
import { getInitials } from "@/utils/helpers";
import echo from "@/lib/echo";
import type { IMessage, INotificationMessage } from "@/interfaces/IMessage";
import {
  getMessages,
  markNotificationRead,
} from "@/services/notification.service";
import { MessageNotification } from "./MessageNotification";

export const Messages = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["messages", page, perPage, user?.id],
    queryFn: () => getMessages(),
    enabled: !!user?.id,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllMessages(data.data);
      } else {
        setAllMessages((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.data.length === perPage);
    }
  }, [data, page, perPage]);
  useEffect(() => {
    if (user?.id) {
      const userChannel = echo.private(`App.Models.User.${user.id}`);

      userChannel.listen(".new-response", (event: INotificationMessage) => {
        const notificationData =
          typeof event === "string" ? JSON.parse(event) : event;
       
        if (!window.location.pathname.includes("/tickets/")) {
            
          MessageNotification(notificationData, user?.role || "client");
        } else {
          queryClient.refetchQueries({
            queryKey: ["ticket", notificationData.response.ticket_id],
            exact: false,
          });
          queryClient.setQueryData(["notification_id"], {
            notif_id: notificationData.id,
            ticket_id: notificationData.response.ticket_id,
          });
        }

        refetch();
      });

      return () => {
        echo.leave(`App.Models.User.${user.id}`);
      };
    }
  }, [user, refetch, queryClient]);

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

  const loadMoreMessages = async () => {
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    setIsLoadingMore(false);
  };

  const messages = allMessages || [];
  const totalUnreadCount = messages.reduce(
    (total, message) => total + (message.unread_count || 0),
    0
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare size={20} />
          {totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalUnreadCount}
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
            <span className="font-semibold">Messages</span>
            {totalUnreadCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {totalUnreadCount} new
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center text-center py-4 text-muted-foreground">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No messages
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <DropdownMenuItem
                  key={message.notification.id}
                  onClick={() => {
                    if (message.notification.read_at === null) {
                      markAsRead(message.notification.id);
                    }
                    navigate(
                      `/${user?.role}/tickets/${message.notification.response.ticket_id}`
                    );
                  }}
                  className={`flex flex-col items-start p-3 gap-1 cursor-pointer ${
                    !message.notification.read_at ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            BASE_API_URL?.replace("/api", "/storage/") +
                            message.notification.user.avatar
                          }
                          alt={message.notification.user.name}
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {getInitials(message.notification.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {message.notification.user.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.notification.created_at)}{" "}
                    </span>
                    {message?.unread_count > 0 && (
                      <span className="bg-red-400 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs">
                        {message.unread_count || 0}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground ml-10">
                    {message.notification.message}
                  </p>
                  <p className="text-xs border-l-2 border-blue-300 pl-2 ml-10 mt-1 italic">
                    "{message.notification.response.message}"
                  </p>
                </DropdownMenuItem>
              ))}
              {hasMore && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMoreMessages}
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
