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
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { z } from "zod";
import { AttachedFiles } from "@/components/dashboard/client/TicketForm/AttachedFiles";
import { PriorityButtons } from "@/components/dashboard/client/TicketForm/PriorityButtons";
import { Button } from "@/components/ui/button";
import { AttachingFiles } from "@/components/dashboard/client/TicketForm/AttachingFiles";
import { addTicket } from "@/services/ticket.service";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const AddTicket = () => {
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
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
  const { data: departments } = useQuery<IResponse<IDepartment>, Error>({
    queryKey: ["departments", 1, "150"],
    queryFn: () => getDepartments(1, "150"),
    staleTime: 5000,
  });

  const handleCreate = async (values: z.infer<typeof TicketSchema>) => {
    setLoading(true);
    try {
      await addTicket({ ...values });

      navigate("/client/tickets");
      toast.success("Ticket created successfully!");
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
  return (
    <main className="p-8 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create new Ticket
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill out the form below to submit a new ticket
          </p>
        </div>
      </div>

      <Card className="border-none shadow-none p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="flex flex-col gap-4"
          >
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
                      className="h-11 text-base px-4 py-3"
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
                    Ticket Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details here about your issue"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <small className="text-slate-400 text-xs">
                    Include any relevant details that would help us resolve your
                    issue
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
                      <AttachingFiles
                        onChange={field.onChange}
                        attachedFiles={attachedFiles}
                        setAttachedFiles={setAttachedFiles}
                      />
                      <AttachedFiles
                        setAttachedFiles={setAttachedFiles}
                        attachedFiles={attachedFiles}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <small className="text-slate-400 text-xs">
                    Include screenshots or documents that would help us resolve
                    your issue
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center">
              <Button disabled={loading} type="submit">Submit


                {loading && <Loader2 className="animate-spin w-4 h-4"/>}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default AddTicket;
