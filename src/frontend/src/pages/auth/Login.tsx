import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link} from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/utils/formSchema";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
export function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { email, password } = values;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof Object) {
        Object.entries(error).forEach(
          ([field, msgArray]: [string, string[]]) => {
            form.setError(field as keyof z.infer<typeof loginSchema>, {
              type: "server",
              message: Array.isArray(msgArray) ? msgArray.join(", ") : msgArray,
            });
          }
        );
      } else toast.error("Something went wrong");
    }
    setLoading(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-50 flex items-center justify-center"
      >
        <Card className="w-full max-w-sm min-h-xl shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              
              <h1 className="text-2xl uppercase font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TicketFlow
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
                TICKET ISSUE MANAGEMENT
              </p>
            </CardTitle>

            <CardDescription className="text-center mt-4">
              Don’t have an account? Get{" "}
              <Link
                to={"/register"}
                className="font-semibold text-blue-600 hover:underline"
              >
                Started
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="h-11 text-base px-4 py-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        className="h-11 text-base px-4 py-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900"
              size={"lg"}
            >
              Login
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
