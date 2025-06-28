import { DataTable } from "@/components/dashboard/data-table";
import { useDebounce } from "@/hooks/useDebounce";
import { type IResponse } from "@/interfaces/IResponse";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "@/components/dashboard/agent/ColumnsTicket";

import { getUserTickets } from "@/services/ticket.service";
import type { ITicket } from "@/interfaces/ITicket";

import { useNavigate } from "react-router-dom";
import { TableFilters } from "@/components/dashboard/client/TableFilters";

const AssignedTicket = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 200);

  const { data, isLoading } = useQuery<IResponse<ITicket>, Error>({
    queryKey: ["agents", page, perPage, debouncedQuery, status, priority],
    queryFn: () =>
      getUserTickets({
        page,
        perPage,
        query: debouncedQuery,
        status,
        priority,
      }),
    staleTime: 5000,
  });

  

  const handleUpdate = (id: string) => {
    navigate(`/agent/tickets/${id}`);
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

      <DataTable<ITicket, ColumnDef<ITicket>>
        onSearchChange={setQuery}
        query={query}
        columns={columns({ onEdit: handleUpdate })}
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
    </main>
  );
};

export default AssignedTicket;
