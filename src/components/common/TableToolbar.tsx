import { type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnum } from "@/utils/format";

type ToolbarFilter = {
  placeholder: string;
  value?: string;
  onChange: (value?: string) => void;
  allLabel: string;
  options: readonly string[];
};

type TableToolbarProps = {
  search?: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };

  filters?: ToolbarFilter[];

  actions?: ReactNode;
};

function TableToolbar({ search, filters, actions }: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
    {search && (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-transparent select-none">
          Search
        </label>
        <Input
          placeholder={search.placeholder}
          className="w-80"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
        />
      </div>
    )}

    {filters?.map((filter) => (
      <div key={filter.placeholder} className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {filter.placeholder}
        </label>

        <Select
          value={filter.value ?? "ALL"}
          onValueChange={(value) =>
            filter.onChange(value === "ALL" ? undefined : value)
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">{filter.allLabel}</SelectItem>

            {filter.options.map((option) => (
              <SelectItem key={option} value={option}>
                {formatEnum(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ))}
  </div>

  {actions}
</div>
  );
}

export default TableToolbar;
