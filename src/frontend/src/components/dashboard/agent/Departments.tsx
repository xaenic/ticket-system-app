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
export function Departments({ departments }: { departments: IDepartment[] }) {
  return (
    <>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Departments</SelectLabel>

          {departments.map((dept) => (
            <SelectItem key={dept.id+""} value={dept.id}>
              {dept.name}

            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </>
  );
}
