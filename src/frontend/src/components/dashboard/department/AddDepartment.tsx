import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDepartment } from "@/services/department.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
export function AddDepartment({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [department, setDepartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const resp = await addDepartment(department);
      queryClient.invalidateQueries({
        queryKey: ["departments"], // base key — matches any related queries
        exact: false,
      });
      toast.success(resp);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof Object) {
            toast.error(String((error as { name?: string }).name));
      }else
      toast.error("Something went wrong");
    }
    setLoading(false);
    setIsOpen(false);
    setDepartment("");
  };
  return (
    <div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Department</DialogTitle>
          <DialogDescription>Add a new Department</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              id="name-1"
              name="name"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            Save changes
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
