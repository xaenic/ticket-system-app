import { useAuth } from "@/hooks/useAuth";
import type { TicketResponse } from "@/interfaces/ITicket";
import { useEffect, useRef } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Attachment } from "../Attachment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_API_URL } from "@/utils/api";
import { getInitials } from "@/utils/helpers";
export const ResponseMessages = ({
  responses,
}: {
  responses: TicketResponse[];
}) => {
  const { user } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [responses]);
  const myMessage = (response: TicketResponse) => {
    return (
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              BASE_API_URL?.replace("/api", "/storage/") +
              response?.user?.avatar
            }
            alt={response?.user?.name}
          />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {getInitials(response?.user?.name || "")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">You</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(parseISO(response.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{response.message}</p>
            <div className="flex flex-wrap gap-2">
              {response.attachments?.map((attachment) => (
                <Attachment file={attachment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const yourMessage = (response: TicketResponse) => {
    return (
      <div className="flex gap-3 items-center justify-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              BASE_API_URL?.replace("/api", "/storage/") +
              response?.user?.avatar
            }
            alt={response?.user?.name}
          />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {getInitials(response?.user?.name || "")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {response.user.name}
              </span>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{response.message}</p>
            <div className="flex flex-wrap gap-2">
              {response.attachments?.map((attachment) => (
                <Attachment file={attachment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div ref={containerRef} className="space-y-4 max-h-96 overflow-y-auto">
      {responses.map((response) => {
        return user?.id == response.user_id + ""
          ? myMessage(response)
          : yourMessage(response);
      })}
    </div>
  );
};
