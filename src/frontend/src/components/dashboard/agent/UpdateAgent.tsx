import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { updateAgentSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import { Departments } from "./Departments";
import { Select } from "@/components/ui/select";
import type { IDepartment } from "@/interfaces/IDepartment";
import { updateAgent } from "@/services/agent.service";
import type { IUser } from "@/interfaces/IUser";

export function UpdateAgent({
  setIsOpen,
  departments,
  agent,
}: {
  setIsOpen: (isOpen: boolean) => void;
  departments: IDepartment[];
  agent: IUser | null;
}) {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: z.infer<typeof updateAgentSchema>) => {
    setLoading(true);
    const { name, department_id } = values;

    try {
      const data = await updateAgent(name, agent?.id || "", department_id + "");

      if (data instanceof Object) {
        Object.entries(data).forEach(
          ([field, msgArray]: [string, string[]]) => {
            form.setError(field as keyof z.infer<typeof updateAgentSchema>, {
              type: "server",
              message: msgArray.join(", "),
            });
          }
        );
        setLoading(false);
        return;
      }
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["agents"], //
        exact: false,
      });

      form.reset();
      toast.success("Successfully added agent");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add agent"
      );
    }

    setLoading(false);
  };

  const form = useForm<z.infer<typeof updateAgentSchema>>({
    resolver: zodResolver(updateAgentSchema),
    defaultValues: {
      name: "",
      email: "",
      department_id: "",
    },
  });

  // Reset form when agent changes
  useEffect(() => {
    if (agent) {
      form.reset({
        name: agent.name || "",
        email: agent.email || "",
        department_id: agent.department?.id + "" || "",
      });
    }
  }, [agent, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Update Agent {agent?.name}</DialogTitle>
            <DialogDescription>Update an existing Agent</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              disabled
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {departments.length > 0 && (
              <FormField
                name="department_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor="department">Department</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <Departments departments={departments} />
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                form.trigger();
                if (form.formState.isValid) handleSubmit(form.getValues());
              }}
              disabled={loading}
            >
              Save changes
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Form>
  );
}
