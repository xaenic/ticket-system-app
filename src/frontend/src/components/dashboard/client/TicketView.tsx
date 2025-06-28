import { Card } from "@/components/ui/card";
import type { ITicket } from "@/interfaces/ITicket";
import { AttachedFiles } from "@/components/dashboard/client/TicketForm/AttachedFiles";
import type { Dispatch, SetStateAction } from "react";
import { MessageCircle, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDateInWords } from "@/utils/formatDate";
import { ResponseMessages } from "../ResponseMessages";
import { ResponseInput } from "../ResponseInput";
import type { FileWithId } from "@/utils/formatfile";
import { getPriorityColor, getStatusColor } from "@/utils/colors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_API_URL } from "@/utils/api";
import { getInitials } from "@/utils/helpers";

interface TicketViewProps {
  ticket: ITicket;
  attachedFiles: File[];
  setAttachedFiles: Dispatch<SetStateAction<FileWithId[] | File[]>>;
}

const TicketView = ({
  ticket,
  attachedFiles,
  setAttachedFiles,
}: TicketViewProps) => {
  return (
    <Card className="border-none shadow-none p-4">
      <div className=" gap-2 flex  items-center  justify-between">
        <div className="font-semibold text-lg flex items-center gap-2">
          <Ticket className="w-5 h-5 text-blue-300" />
          <p className="text-base">{ticket.title}</p>
        </div>
        <div className="gap-2 flex items-center">
          <div className="">
            <span
              className={`${getPriorityColor(
                ticket.priority || "low"
              )} px-3 py-1  uppercase rounded-md font-semibold text-xs h-full`}
            >
              {ticket.priority}
            </span>
          </div>
          <span
            className={`${
              getStatusColor(ticket.status) ||
              "bg-gray-100 text-gray-700 border border-gray-200"
            } px-3 py-1 uppercase rounded-md font-semibold text-xs`}
          >
            {ticket.status}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        <div className="grid grid-cols-3 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Ticket ID</label>
            <div className="">
              <p className="text-base text-xs font-medium">TKT-{ticket.id}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Department</label>
            <div className="">
              <p className="text-base text-xs font-medium">
                {ticket.department.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Created At</label>
            <div className="">
              <p className="text-base text-xs font-medium">
                {formatDateInWords(ticket.created_at || "")}
              </p>
            </div>
          </div>
           <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Ticket Owner</label>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    BASE_API_URL?.replace("/api", "/storage/") +
                    ticket.client?.avatar
                  }
                  alt={ticket?.client?.name}
                />
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {getInitials(ticket?.client?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base text-xs font-medium">
                  {ticket.client?.name || "Unassigned"}
                </p>
               
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Assigned Agent</label>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    BASE_API_URL?.replace("/api", "/storage/") +
                    ticket?.assigneduser?.avatar
                  }
                  alt={ticket?.assigneduser?.name}
                />
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {getInitials(ticket?.assigneduser?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base text-xs font-medium">
                  {ticket.assigneduser?.name || "Unassigned"}
                </p>
                <p className="text-base text-xs text-slate-500">
                  {ticket.assigneduser?.email || "Unassigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ticket Description
          </label>
          <div className="min-h-[100px] bg-slate-100 p-3 rounded-md">
            <p className="text-base whitespace-pre-wrap text-sm">
              {ticket.description}
            </p>
          </div>
          <small className="text-slate-400 text-xs">
            Include any relevant details that would help us resolve your issue
          </small>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Attachments
          </label>
          <div className="space-y-4">
            <AttachedFiles
              setAttachedFiles={setAttachedFiles}
              attachedFiles={attachedFiles}
              onChange={() => {}}
            />
          </div>
          <small className="text-slate-400 text-xs">
            {attachedFiles.length == 0
              ? "No files attached"
              : "Files attached to this ticket"}
          </small>
        </div>
        <Separator className="border border-slate-100" />
        {ticket.assigned_user_id && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <label className="text-sm font-medium text-gray-600">
                Conversation History
              </label>
            </div>
            <ResponseMessages responses={ticket.responses || []} />

            {ticket.status !== "closed" && ticket.status !== "resolved" && (
              <ResponseInput />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TicketView;
