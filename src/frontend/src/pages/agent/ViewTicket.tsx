import type { IDepartment } from "@/interfaces/IDepartment";
import type { IResponse } from "@/interfaces/IResponse";
import { getDepartments } from "@/services/department.service";
import { TicketSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";

import {
  assignTicket,
  getTicket,
  updateTicket,
  updateTicketStatus,
} from "@/services/ticket.service";
import toast from "react-hot-toast";
import { Cross, Loader2, Lock, MoveDown, X } from "lucide-react";
import type { Attachment, ITicket } from "@/interfaces/ITicket";
import { attachmentToFile } from "@/utils/formatfile";
import TicketView from "@/components/dashboard/client/TicketView";
import { useAuth } from "@/hooks/useAuth";

const ViewTicket = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const { data, isError, isLoading } = useQuery<IResponse<ITicket>, Error>({
    queryKey: ["ticket", id],
    queryFn: () => getTicket(id || ""),
    staleTime: 5000,
    retry: false,
  });
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const handleAssignment = async () => {
    setLoading(true);
    try {
      await assignTicket(id || "");

      queryClient.invalidateQueries({
        queryKey: ["ticket", id],
        exact: false,
      });
      toast.success("Successfully updated ticket");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create ticket"
      );
    }
    setLoading(false);
  };
  const ticketStatus = data?.data[0]?.status;
  const isTicketClosed = ticketStatus !== "open";
  const isAssigned = user?.id === data?.data[0]?.assigned_user_id;

  const handleStatusUpdate = async (status: "closed" | "resolved") => {
    setLoading(true);
  
    try {
      await updateTicketStatus(status, id || "");

      queryClient.invalidateQueries({
        queryKey: ["ticket", id],
        exact: false,
      });
       queryClient.invalidateQueries({
        queryKey: ["ticket"],
        exact: false,
      });
      toast.success("Successfully updated ticket");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create ticket"
      );
    }

    setLoading(false);
  };
  const hadleScrollDown = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (data) {
      const files = (data.data[0]?.attachments as Attachment[])?.map(
        attachmentToFile
      );
      setAttachedFiles(files || []);
    }
  }, [data]);
  return isError ? (
    <p>Not found </p>
  ) : isLoading ? (
    <p>Loading</p>
  ) : (
    <main className="p-8 space-y-4 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            View Ticket{" "}
            <span className="text-blue-500"> #{data?.data[0]?.id}</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            View & manage your ticket responses and status {user?.id}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2"></div>
        <div className="flex">
          <div className="flex gap-2">
            { isAssigned &&  ticketStatus !== "closed" && ticketStatus !== "resolved" && (
              <>
                <Button
                  disabled={loading}
                  onClick={handleStatusUpdate.bind(null, "closed")}
                  variant="ghost"
                  className="bg-slate-100"
                >
                  <X /> Close Ticket
                  {loading && <Loader2 className="animate-spin w-4 h-4" />}
                </Button>
                <Button
                  disabled={loading}
                  onClick={handleStatusUpdate.bind(null, "resolved")}
                  variant={"outline"}
                  className=""
                >
                  Mark as Resolved
                  {loading && <Loader2 className="animate-spin w-4 h-4" />}
                </Button>
              </>
            )}
            <Button
              onClick={handleAssignment}
              disabled={loading || isAssigned}
              variant="default"
            >
              {isAssigned ? "Assigned" : "Assign to me"}

              {loading && <Loader2 className="animate-spin w-4 h-4" />}
            </Button>
          </div>
          <Button onClick={hadleScrollDown} className="" variant={"ghost"}>
            <MoveDown className="w-4 h-5 text-slate-600" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isTicketClosed && (
          <div
            className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full"
            data-id="element-318"
          >
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-sm" data-id="element-320">
              This ticket cannot be edited (
              <span className="uppercase text-xs">{ticketStatus}</span>)
            </span>
          </div>
        )}
      </div>
      {data?.data[0] && (
        <TicketView
          ticket={data.data[0]}
          attachedFiles={attachedFiles}
          setAttachedFiles={setAttachedFiles}
        />
      )}
      <div className="#bottom"></div>
    </main>
  );
};

export default ViewTicket;
