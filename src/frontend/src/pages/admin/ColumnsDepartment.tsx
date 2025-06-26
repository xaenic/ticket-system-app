import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import type { IDepartment } from "@/interfaces/IDepartment";
import { formatDateInWords } from "@/utils/formatDate";
import type { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, Trash2 } from "lucide-react";
interface DepartmentColumnsProps {
  onEdit: (dept: IDepartment) => void;
  onDelete: (id: string) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: DepartmentColumnsProps): ColumnDef<IDepartment>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => {
      const formatted = formatDateInWords(row.getValue("created_at"));
      return formatted;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Date Updated",
    cell: ({ row }) => {
      const formatted = formatDateInWords(row.getValue("updated_at"));
      return formatted;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start">
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={() =>
                onEdit({
                  id: row.getValue("id"),
                  name: row.getValue("name"),
                })
              }
            >
              <FilePenLine className="h-4 w-4 text-blue-500" />
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={() => onDelete(row.getValue("id"))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </DialogTrigger>
        </div>
      );
    },
  },
];
