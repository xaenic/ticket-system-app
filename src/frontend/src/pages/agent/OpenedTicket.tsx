import { columns } from "@/components/dashboard/agent/ColumnsTicket";
import { DataTable } from "@/components/dashboard/data-table";
import { useDebounce } from "@/hooks/useDebounce";
import type { IResponse } from "@/interfaces/IResponse";
import type { ITicket } from "@/interfaces/ITicket";
import { getOpenTickets } from "@/services/ticket.service";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OpenedTicket = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<IResponse<ITicket>, Error>({
    queryKey: ["departments", page, perPage, debouncedQuery],
    queryFn: () => getOpenTickets(page, perPage, debouncedQuery),
    staleTime: 5000,
  });

  const handleUpdate = (id: string) => {
    navigate(`/agent/tickets/${id}`);
  };
  return (
    <main className="p-4 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground text-sm">
            Claim a ticket to start working on it
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
        />
    </main>
  );
};

export default OpenedTicket;
