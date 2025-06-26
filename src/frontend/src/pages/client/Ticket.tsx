import { DataTable } from "@/components/dashboard/data-table";
import { useDebounce } from "@/hooks/useDebounce";
import { type IResponse } from "@/interfaces/IResponse";
import { Dialog } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "@/components/dashboard/client/ColumnsTicket";

import type { IUser } from "@/interfaces/IUser";
import { DeleteAgent } from "@/components/dashboard/agent/DeleteAgent";
import { getUserTickets } from "@/services/ticket.service";
import type { ITicket } from "@/interfaces/ITicket";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TableFilters } from "@/components/dashboard/client/TableFilters";

const Ticket = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [agent, setAgent] = useState<IUser | null>(null);

  const debouncedQuery = useDebounce(query, 200);

  const { data, isLoading } = useQuery<IResponse<ITicket>, Error>({
    queryKey: ["agents", page, perPage, debouncedQuery, status, priority],
    queryFn: () =>
      getUserTickets(page, perPage, debouncedQuery, status, priority),
    staleTime: 5000,
  });

  const handleAdd = () => {
    navigate("add");
  };

  const handleUpdate = (ticket: ITicket) => {
    console.log(ticket);
  };

  const handleDelete = (id: string) => {
    setAgent({
      id: id,
      name: "",
      email: "",
    });
  };

  return (
    <main className="p-4 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ticket Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your tickets here.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button size={"sm"} onClick={handleAdd} variant={"default"}>
          <PlusIcon />
          New Ticket
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DataTable<ITicket, ColumnDef<ITicket>>
          onSearchChange={setQuery}
          query={query}
          columns={columns({ onDelete: handleDelete, onEdit: handleUpdate })}
          isLoading={isLoading}
          data={data?.data || []}
          page={page}
          total={data?.total || 0}
          from={data?.from || 0}
          to={data?.to || 0}
          lastPage={data?.last_page || 1}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          tableTitle=""
          SideButton={() =>
            TableFilters({
              status,
              priority,
              onStatusChange: setStatus,
              onPriorityChange: setPriority,
            })
          }
        />
        <DeleteAgent setIsOpen={setIsOpen} user={agent} />
      </Dialog>
    </main>
  );
};

export default Ticket;
