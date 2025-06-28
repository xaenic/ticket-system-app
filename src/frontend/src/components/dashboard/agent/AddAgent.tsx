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
import { agentSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import { Departments } from "./Departments";
import { Select } from "@/components/ui/select";
import type { IDepartment } from "@/interfaces/IDepartment";
import { addAgent } from "@/services/agent.service";
export function AddAgent({
  setIsOpen,
  departments,
}: {
  setIsOpen: (isOpen: boolean) => void;
  departments: IDepartment[];
}) {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: z.infer<typeof agentSchema>) => {
    setLoading(true);
    const { name, email, password, confirmPassword, department_id } = values;

    try {
      await addAgent(
        name,
        email,
        password,
        confirmPassword,
        department_id + ""
      );
    
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["agents"], //
        exact: false,
      });

      form.reset();
      toast.success("Successfully added agent");
    }catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof Object) {
        Object.entries(error).forEach(
          ([field, msgArray]: [string, string[]]) => {
            form.setError(field as keyof z.infer<typeof agentSchema>, {
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

  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      email: "",
      department_id: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>New Agent</DialogTitle>
            <DialogDescription>Add a new Agent</DialogDescription>
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

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage title="sads" />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input id="confirmPassword" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="department_id"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="department">Department</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Departments departments={departments} />
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
