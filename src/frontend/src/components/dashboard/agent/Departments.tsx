import * as React from "react";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IDepartment } from "@/interfaces/IDepartment";
export function Departments({
  departments,
  width = "w-[180px]",
}: {
  departments: IDepartment[];
  width?: string;
}) {
  return (
    <>
      <SelectTrigger className={`${width}`}>
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Departments</SelectLabel>

          {departments.map((dept) => (
            <SelectItem
              key={dept.id + ""}
              value={dept.id.toString()}
              className="text-black"
            >
              {dept.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </>
  );
}
