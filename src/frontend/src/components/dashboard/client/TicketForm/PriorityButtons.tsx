import { Button } from "@/components/ui/button";


export const PriorityButtons = ({ value, onChange } : {value:string, onChange: (event: string) => void}) => {

  return (
    <div className="flex gap-2">
      {["low", "medium", "high"].map((priority) => (
        <Button
          key={priority}
          type="button"
          variant={"ghost"}
          onClick={() => onChange(priority)}
          className={`hover:bg-none px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
            value === priority
              ? priority === "low"
                ? "bg-green-100 text-green-800 border-green-300"
                : priority === "medium"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-red-100 text-red-800 border-red-300"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Button>
      ))}
    </div>
  );
};

