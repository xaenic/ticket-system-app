import { useAuth } from "@/hooks/useAuth";
import type { TicketResponse } from "@/interfaces/ITicket";
import React, { useEffect, useRef } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FileText } from "lucide-react";
export const ResponseMessages = ({
  responses,
}: {
  responses: TicketResponse[];
}) => {
  const { user } = useAuth();


  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(()=>{

    if(containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  },[responses])
  const myMessage = (response: TicketResponse) => {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>
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
            <p className="text-sm text-gray-700">{response.message}</p>
            <div className="flex flex-wrap gap-2">
              {response.attachments?.map((attachment) => (
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
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
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
           {response.user.name[0]} 
        </div>
        <div className="flex-1">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {response.user.name}
              </span>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <p className="text-sm text-gray-700">{response.message}</p>
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
