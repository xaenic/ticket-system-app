import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_API_URL } from "@/utils/api";
import { getInitials } from "@/utils/helpers";
import { formatDate } from "@/utils/formatDate";
import type { INotificationMessage } from "@/interfaces/IMessage";

export const MessageNotification = (
  message: INotificationMessage,
  userRole?: string
) => {
  const isMobile = window.innerWidth < 768;

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-white max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex p-4 border-l-4 border-blue-500 relative`}
        style={{
          position: "fixed",
          bottom: isMobile ? "auto" : "20px",
          top: isMobile ? "20px" : "auto",
          left: "10px",
          zIndex: 9999,
        }}
      >
        <div
          onClick={() => {
            toast.dismiss(t.id);
            window.location.href = `/${userRole}/tickets/${message.response.ticket_id}`;
          }}
          className="flex items-start gap-3 w-full cursor-pointer"
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  BASE_API_URL?.replace("/api", "/storage/") +
                  message.user.avatar
                }
                alt={message.user.name}
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(message.user.name || "AA")}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex justify-between items-center w-full">
              <p className="font-bold text-sm text-blue-600">
                {message.user.name}
              </p>
              <span className="text-xs text-gray-500">
                {formatDate(message.created_at)}
              </span>
            </div>
            <p className="font-semibold text-sm">{message.message}</p>
            <p className="text-xs text-[#555] font-medium">
              Ticket #{message.response.ticket_id}
            </p>
            <p className="text-xs text-[#777] line-clamp-2 mb-1">
              {message.response.message}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      duration: 1000,
      position: isMobile ? "top-center" : "bottom-left",
    }
  );
};
