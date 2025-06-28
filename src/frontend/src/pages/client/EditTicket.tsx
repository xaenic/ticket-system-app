import { Departments } from "@/components/dashboard/agent/Departments";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IDepartment } from "@/interfaces/IDepartment";
import type { IResponse } from "@/interfaces/IResponse";
import { getDepartments } from "@/services/department.service";
import { TicketSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {  useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { AttachedFiles } from "@/components/dashboard/client/TicketForm/AttachedFiles";
import { PriorityButtons } from "@/components/dashboard/client/TicketForm/PriorityButtons";
import { Button } from "@/components/ui/button";
import { AttachingFiles } from "@/components/dashboard/client/TicketForm/AttachingFiles";
import { getTicket, updateTicket } from "@/services/ticket.service";
import toast from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";
import type { Attachment, ITicket } from "@/interfaces/ITicket";
import { attachmentToFile } from "@/utils/formatfile";
import TicketView from "@/components/dashboard/client/TicketView";
import { NewAttachedFiles } from "@/components/dashboard/client/TicketForm/NewAttachedFiles";

const EditTicket = () => {

  const { id } = useParams();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedFiles, setDeletedfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: departments } = useQuery<IResponse<IDepartment>, Error>({
    queryKey: ["departments", 1, "150"],
    queryFn: () => getDepartments(1, "150"),
    staleTime: 5000,
  });

  const { data, isError, isLoading } = useQuery<IResponse<ITicket>, Error>({
    queryKey: ["ticket", id],
    queryFn: () => getTicket(id || ""),
    staleTime: 5000,
    retry: false,
  });
  const queryClient = useQueryClient();
  const handleCreate = async (values: z.infer<typeof TicketSchema>) => {
    setLoading(true);
    try {
      await updateTicket({
        ...values,
        attachments: newFiles,
        deleted_files: deletedFiles,
        id: id || "",
      });

      
      queryClient.invalidateQueries({
        queryKey: ["ticket", id], // base key — matches any related queries
        exact: false,
      });
      toast.success("Successfully updated ticket");
      setNewFiles([]);
      setAttachedFiles([]);
      setIsEditMode(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof Object) {
        Object.entries(error).forEach(
          ([field, msgArray]: [string, string[]]) => {
            form.setError(field as keyof z.infer<typeof TicketSchema>, {
              type: "server",
              message: Array.isArray(msgArray) ? msgArray.join(", ") : msgArray,
            });
          }
        );
      }else
      toast.error("Something went wrong");
    
    }
    setLoading(false);
  };
  const priorityDesc = {
    low: "Can be addressed in the normal course of business",
    medium: "Requires attention within 24-48 hours",
    high: "Critical issue requiring immediate attention",
  };

  const ticketStatus = data?.data[0]?.status;
  const isTicketClosed = ticketStatus !== "open";
  const canEdit = !isTicketClosed;

  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      department_id: "",
      attachments: null,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data?.data[0]?.title,
        description: data?.data[0]?.description,
        priority: data?.data[0]?.priority,
        department_id: data?.data[0]?.department_id + "",
        attachments: null,
      });

      const files = (data.data[0]?.attachments as Attachment[])?.map(
        attachmentToFile
      );
      setAttachedFiles(files || []);
    }
  }, [data, form]);
  return isError ? (
    <p>Not found </p>
  ) : isLoading ? (
    <p>Loading</p>
  ) : (
    <main className="p-8 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            View Ticket{" "}
            <span className="text-blue-500"> #{data?.data[0]?.id}</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            View & manage your ticket responses and status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isEditMode ? "secondary" : "default"}
            onClick={() => setIsEditMode(!isEditMode)}
            disabled={!canEdit}
          >
            {isEditMode ? "View Mode" : "Edit Mode"}
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
      {data?.data[0] &&
        (!isEditMode ? (
          <TicketView
            ticket={data.data[0]}
            attachedFiles={attachedFiles}
            setAttachedFiles={setAttachedFiles}
          />
        ) : (
          <Card className="border-none shadow-none p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreate)}
                className="flex flex-col gap-4"
              >
                {/* ...existing form fields... */}
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">
                        Ticket Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="text"
                          placeholder="Brief summry of the issue"
                          className={`h-11 text-base px-4 py-3 ${
                            !isEditMode || !canEdit
                              ? "bg-gray-50 border-gray-200"
                              : ""
                          }`}
                          readOnly={!isEditMode || !canEdit}
                          {...field}
                        />
                      </FormControl>
                      <small className="text-slate-400 text-xs">
                        A clear, concise title helps us route your ticket to the
                        right team
                      </small>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="department_id"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid gap-2 w-full">
                        <FormLabel htmlFor="department">
                          Department<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!isEditMode || !canEdit}
                          >
                            <Departments
                              width="w-full"
                              departments={departments?.data || []}
                            />
                          </Select>
                        </FormControl>
                        <small className="text-slate-400 text-xs">
                          Select the appropriate department for your issue{" "}
                          {field.value}
                        </small>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="priority"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid gap-2 w-full">
                        <FormLabel htmlFor="priority">
                          Priority<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PriorityButtons
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <small className="text-slate-400 text-xs">
                          {priorityDesc[field.value]}
                        </small>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="description">
                        Ticket Description{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details here about your issue"
                          {...field}
                          rows={4}
                          readOnly={!isEditMode || !canEdit}
                          className={
                            !isEditMode || !canEdit
                              ? "bg-gray-50 border-gray-200"
                              : ""
                          }
                        />
                      </FormControl>
                      <small className="text-slate-400 text-xs">
                        Include any relevant details that would help us resolve
                        your issue
                      </small>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="attachments"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="attachments">Attachments</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {isEditMode && canEdit && (
                            <AttachingFiles
                              onChange={field.onChange}
                              attachedFiles={newFiles}
                              setAttachedFiles={setNewFiles}
                            />
                          )}

                          {newFiles.length > 0 && (
                            <>
                              <h1 className="text-slate-500 font-semibold text-xs">
                                New Files
                              </h1>
                              <NewAttachedFiles
                                newFiles={newFiles}
                                setNewFiles={setNewFiles}
                              />
                            </>
                          )}

                          <h1 className="text-slate-500 font-semibold text-xs">
                            Attached Files
                          </h1>
                          <AttachedFiles
                            setAttachedFiles={setAttachedFiles}
                            setDeletedFiles={setDeletedfiles}
                            attachedFiles={attachedFiles}
                            onChange={field.onChange}
                            from={isEditMode ? "Edit" : "View"}
                          />
                        </div>
                      </FormControl>
                      <small className="text-slate-400 text-xs">
                        {isEditMode && canEdit
                          ? "Include screenshots or documents that would help us resolve your issue"
                          : "Files attached to this ticket"}
                      </small>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditMode && canEdit && (
                  <div className="flex justify-end items-center">
                    <Button
                      disabled={loading}
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-400"
                    >
                      Update
                      {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </Card>
        ))}
    </main>
  );
};

export default EditTicket;
