import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TableFilters = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: {
  status: string;
  priority: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}) => {
  return (
    <div className="flex gap-2">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter By Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter By Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            <SelectItem value="all">All Priority</SelectItem>

            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
