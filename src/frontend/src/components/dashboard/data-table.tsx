"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Loader2, PlusIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { RowsPerPage } from "./RowsPerPage";
import { DialogTrigger } from "../ui/dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  total: number;
  perPage: string;
  lastPage: number;
  from: number;
  to: number;
  isLoading: boolean;
  query: string;
  tableTitle: string;
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  total,
  perPage,
  from,
  to,
  lastPage,
  isLoading,
  query,
  tableTitle,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onAddClick,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: 0, // React Table uses 0-based indexing
        pageSize: parseInt(perPage),
      },
    },
    pageCount: lastPage,
  });

  return (
    <div className="rounded-md border-none bg-white ">
      <div className="flex p-4 justify-between items-center">
        <div>
          <Input
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div>
          <DialogTrigger asChild>
            <Button size={"sm"} onClick={onAddClick} variant={"default"}>
              <PlusIcon />
              New {tableTitle}
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-slate-100 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-none p-4" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="p-4 font-medium text-slate-800"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="relative">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <TableRow className="border-none" key={index}>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center relative"
                  >
                    {index === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="mr-2 h-8 w-8 animate-spin text-slate-600" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="border-none"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className=" p-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator className="border border-slate-100" />
      <div className="  flex items-center justify-between space-x-2 p-2 p-3">
        <div className="text-xs text-muted-foreground"></div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <p className="text-gray-700 font-medium text-sm">Rows per page:</p>
            <RowsPerPage
              rowsPerpage={perPage}
              onValueChange={onPerPageChange}
            />
          </div>
          <div>
            <p className="text-gray-700 font-medium text-sm">
              {from} – {to} of {total}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => onPageChange(page - 1)}
              disabled={page - 1 === 0}
            >
              <ChevronLeft className="text-black font-medium" />
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => onPageChange(page + 1)}
              disabled={page === lastPage || !table.getCanNextPage()}
            >
              <ChevronRight className="h-12 w-12 text-black font-medium" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
