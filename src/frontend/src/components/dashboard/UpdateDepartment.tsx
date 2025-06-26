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
import type { IDepartment } from "@/interfaces/IDepartment";
import {  updateDepartment } from "@/services/department.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export function UpdateDepartment({
  setIsOpen,
  department,
}: {
  setIsOpen: (isOpen: boolean) => void;
  department: IDepartment | null;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(department?.name || "");
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const resp = await updateDepartment(name, department?.id || "");
      queryClient.invalidateQueries({
        queryKey: ["departments"], // base key — matches any related queries
        exact: false,
      });
      toast.success(resp);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update department"
      );
    }
    setLoading(false);
    setIsOpen(false);
    setName("");
  };
  useEffect(()=> {
    setName(department?.name || "");
  },[department ])
  return (
    <div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Department</DialogTitle>
          <DialogDescription>Edit the name of the department</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              value={name ?? department?.name}
              onChange={(e) => setName(e.target.value)}
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
