import toast from "react-hot-toast";
import type { INotification } from "@/interfaces/INotification";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BASE_API_URL } from "@/utils/api";
import { getInitials } from "@/utils/helpers";
import { formatDate } from "@/utils/formatDate";
import { getPriorityColor, getStatusColor } from "@/utils/colors";

interface NotificationAlertProps {
  notification?: INotification;
  role?: string;
}

export const NotificationAlert = (props: NotificationAlertProps = {}) => {
  const { notification, role } = props;

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-white max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex p-4 border-l-4 border-blue-500 relative`}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "10px",
          zIndex: 9999,
        }}
      >
        <div
          onClick={() => {
            toast.dismiss(t.id);
            window.location.href = `/${role}/tickets/${notification?.ticket?.id}`;
          }}
          className="flex items-start gap-3 w-full cursor-pointer"
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  BASE_API_URL?.replace("/api", "/storage/") +
                  (notification?.ticket?.assigneduser?.avatar ||
                    notification?.ticket?.client?.avatar)
                }
                alt={
                  notification?.ticket?.assigneduser?.name ||
                  notification?.ticket?.client?.name
                }
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(
                  notification?.ticket?.assigneduser?.name ||
                    notification?.ticket?.client?.name ||
                    "AA"
                )}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex justify-between items-center w-full">
              <p className="font-bold text-sm text-blue-600">
                {notification?.ticket?.assigneduser?.name ||
                  notification?.ticket?.client?.name ||
                  "Client"}
              </p>
              <span className="text-xs text-gray-500">
                {notification?.created_at
                  ? formatDate(notification.created_at)
                  : "Just now"}
              </span>
            </div>
            <p className="font-semibold text-sm">{notification?.message}</p>
            <p className="text-xs text-[#555] font-medium">
              {notification?.ticket?.title}
            </p>
            <p className="text-xs text-[#777] line-clamp-2 mb-1">
              {notification?.ticket?.description || "No description available."}
            </p>
            <div className="flex gap-2">
              {notification?.ticket?.priority && (
                <span
                  className={`uppercase text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                    notification.ticket.priority
                  )}`}
                >
                  {notification.ticket.priority}
                </span>
              )}
              {notification?.ticket?.status && (
                <span
                  className={`uppercase text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                    notification.ticket.status
                  )} }`}
                >
                  {notification.ticket.status.replace("_", " ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: 5000, // Show for 5 seconds
      position: "bottom-left",
    }
  );
};
