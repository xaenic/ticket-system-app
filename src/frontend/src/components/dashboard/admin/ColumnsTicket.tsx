import { Button } from "@/components/ui/button";
import type { ITicket } from "@/interfaces/ITicket";
import { getPriorityColor, getStatusColor } from "@/utils/colors";
import { formatDateInWords } from "@/utils/formatDate";
import type { ColumnDef } from "@tanstack/react-table";
import { FilePenLine } from "lucide-react";
interface ColumnsProps {
  onEdit: (id: string) => void;
}

export const columns = ({ onEdit }: ColumnsProps): ColumnDef<ITicket>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
    cell: ({ row }) => {
      return <span className="text-blue-500">#{row.getValue("id")}</span>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <span className=" ">
          {row.getValue("title")}
          <br />
          <span className="text-slate-400 text-xs">
            #TKT-{row.getValue("id")}
          </span>
        </span>
      );
    },
  },
  {
    accessorKey: "client.name",
    header: "Client",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span
          className={`${getStatusColor(
            row.getValue("status")
          )} px-2 py-1 uppercase rounded-md font-semibold text-xs`}
        >
          {row.getValue("status")}
        </span>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      return (
        <span
          className={`${getPriorityColor(
            row.getValue("priority") || ""
          )} px-2 py-1 uppercase rounded-md font-semibold text-xs`}
        >
          {row.getValue("priority")}
        </span>
      );
    },
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
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start">
          <Button variant={"ghost"} onClick={() => onEdit(row.getValue("id"))}>
            <FilePenLine className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      );
    },
  },
];
