import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { IDepartment } from "@/interfaces/IDepartment";
import { deleteDepartment } from "@/services/department.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
export function DeleteDepartment({
  setIsOpen,
  department,
}: {
  setIsOpen: (isOpen: boolean) => void;
  department: IDepartment | null;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const resp = await deleteDepartment(department?.id || "");
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
  };

  return (
    <div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Department</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this department?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            Yes
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
