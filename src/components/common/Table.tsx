import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, MoveLeft, MoveRight } from "lucide-react";

function Table<TData>(props: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}) {
  const { columns, data, page, size, onPageChange, onSizeChange, totalElements, totalPages } = props;

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageIndex: page,
        pageSize: size,
      },
    },
  });


  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-secondary">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-semibold"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b transition-colors hover:bg-accent/40"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Rows per page</span>

          <select
            value={size}
            onChange={(e) => {
              onSizeChange(Number(e.target.value));
              onPageChange(0);
            }}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {[10, 20, 50, 100].map((newSize) => (
              <option key={newSize} value={newSize}>
                {newSize}
              </option>
            ))}
          </select>

          <span className="text-sm text-muted-foreground">
            {totalElements} users
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Page</span>

            <input
              type="number"
              min={1}
              max={totalPages}
              value={page + 1}
              onChange={(e) =>
                onPageChange(
                  Math.min(
                    totalPages - 1,
                    Math.max(0, Number(e.target.value) - 1),
                  ),
                )
              }
              className="h-9 w-14 rounded-md border bg-background text-center text-sm"
            />

            <span className="text-muted-foreground">of {totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(0)}
              disabled={page === 0}
            >
              <MoveLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.max(0, totalPages - 1))}
              disabled={page >= totalPages - 1}
            >
              <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
