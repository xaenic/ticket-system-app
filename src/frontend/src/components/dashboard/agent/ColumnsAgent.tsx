import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import type { IUser } from "@/interfaces/IUser";
import { formatDateInWords } from "@/utils/formatDate";
import type { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, Trash2 } from "lucide-react";
interface ColumnsProps {
  onEdit: (dept: IUser) => void;
  onDelete: (id: string) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<IUser>[] => [
  {
    accessorKey: "id",
    header: "ID",

    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    id: "department_id",
    accessorKey: "department.id",
    header: "depid",
    enableHiding: true,
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
                  email: row.getValue("email"),
                  department: row.getValue("department_id"),
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
