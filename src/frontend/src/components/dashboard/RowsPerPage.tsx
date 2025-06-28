
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RowsPerPage({
  onValueChange,
}: {
  onValueChange: (value: number ) => void;
  rowsPerpage: number;
}) {
  return (
    <Select defaultValue="10" onValueChange={(value) => onValueChange(Number(value))}>
      <SelectTrigger className="w-18">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
