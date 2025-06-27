import { Button } from "@/components/ui/button";
import type { ITicket } from "@/interfaces/ITicket";
import { formatDateInWords } from "@/utils/formatDate";
import type { ColumnDef } from "@tanstack/react-table";
import { FilePenLine } from "lucide-react";
interface ColumnsProps {
  onEdit: (id: string) => void;
}

const statusColorCodes = {
  pending: "bg-orange-100 text-orange-700 border border-orange-200",
  closed: "bg-green-100 text-green-700 border border-green-200",
  open: "bg-blue-100 text-blue-700 border border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  resolved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

const priorityColorCodes = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-red-100 text-red-800 border-red-300",
};
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span
          className={`${
            statusColorCodes[
              row.getValue("status") as keyof typeof statusColorCodes
            ]
          } px-2 py-1 uppercase rounded-md font-semibold text-xs`}
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
          className={`${
            priorityColorCodes[
              row.getValue("priority") as keyof typeof priorityColorCodes
            ]
          } px-2 py-1 uppercase rounded-md font-semibold text-xs`}
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
