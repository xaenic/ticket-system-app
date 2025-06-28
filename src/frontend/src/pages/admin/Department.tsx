import { UpdateDepartment } from "@/components/dashboard/department/UpdateDepartment";
import { AddDepartment } from "@/components/dashboard/department/AddDepartment";
import { DataTable } from "@/components/dashboard/data-table";
import { useDebounce } from "@/hooks/useDebounce";
import type { IDepartment } from "@/interfaces/IDepartment";
import { type IResponse } from "@/interfaces/IResponse";
import { getDepartments } from "@/services/department.service";
import { Dialog } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "../../components/dashboard/department/ColumnsDepartment";
import { DeleteDepartment } from "@/components/dashboard/department/DeleteDepartment";

const Department = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [active, setActive] = useState<"add" | "edit" | "delete">("add");
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  const { data, isLoading } = useQuery<IResponse<IDepartment>, Error>({
    queryKey: ["departments", page, perPage, debouncedQuery],
    queryFn: () => getDepartments(page, perPage + "", debouncedQuery),
    staleTime: 5000,
  });

  const handleAdd = () => {
    setActive("add");
  };

  const handleUpdate = (department: IDepartment) => {
    // alert(department.name);
    setActive("edit");
    setDepartment(department);
  };

  const handleDelete = (id: string) => {
    setDepartment({
      id: id,
      name: "",
    });
    setActive("delete");
  };
  return (
    <main className=" p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground text-sm">
            Manage your departments effectivelys
          </p>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DataTable<IDepartment, ColumnDef<IDepartment>>
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
          tableTitle="Department"
        />

        {active === "add" ? (
          <AddDepartment setIsOpen={setIsOpen} />
        ) : active === "edit" ? (
          <UpdateDepartment department={department} setIsOpen={setIsOpen} />
        ) : (
          <DeleteDepartment setIsOpen={setIsOpen} department={department} />
        )}
      </Dialog>
    </main>
  );
};

export default Department;
