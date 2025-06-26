import { DataTable } from "@/components/dashboard/data-table";
import { useDebounce } from "@/hooks/useDebounce";
import type { IDepartment } from "@/interfaces/IDepartment";
import { type IResponse } from "@/interfaces/IResponse";
import { getDepartments } from "@/services/department.service";
import { Dialog } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "@/components/dashboard/agent/ColumnsAgent";
import { AddAgent } from "@/components/dashboard/agent/AddAgent";
import { getAgents } from "@/services/agent.service";
import type { IUser } from "@/interfaces/IUser";
import { UpdateAgent } from "@/components/dashboard/agent/UpdateAgent";
import { DeleteAgent } from "@/components/dashboard/agent/DeleteAgent";

const Agent = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [active, setActive] = useState<"add" | "edit" | "delete">("add");
  const [agent, setAgent] = useState<IUser | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  const { data, isLoading } = useQuery<IResponse<IUser>, Error>({
    queryKey: ["agents", page, perPage, debouncedQuery],
    queryFn: () => getAgents(page, perPage, debouncedQuery),
    staleTime: 5000,
  });
  const { data: departments } = useQuery<IResponse<IDepartment>, Error>({
    queryKey: ["departments", page, perPage, debouncedQuery],
    queryFn: () => getDepartments(page, "150", debouncedQuery),
    staleTime: 5000,
  });

  const handleAdd = () => {
    setActive("add");
  };

  const handleUpdate = (user: IUser) => {
    setActive("edit");
    console.log(user);
    setAgent(user);
  };

  const handleDelete = (id: string) => {
    setAgent({
      id: id,
      name: "",
      email: "",
    });
    setActive("delete");
  };
  return (
    <main className="p-4 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground text-sm">
            Manage your agents effectively
          </p>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DataTable<IUser, ColumnDef<IDepartment>>
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
          onAddClick={handleAdd}
          tableTitle="Agent"
        />

        {active === "add" ? (
          <AddAgent
            setIsOpen={setIsOpen}
            departments={departments?.data || []}
          />
        ) : active === "edit" ? (
          <UpdateAgent
            agent={agent}
            departments={departments?.data || []}
            setIsOpen={setIsOpen}
          />
        ) : (
          <DeleteAgent setIsOpen={setIsOpen} user={agent} />
        )}
      </Dialog>
    </main>
  );
};

export default Agent;
