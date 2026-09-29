import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import type { InwardSource, ItemCategory, ItemStatus } from "../../types/item";

function ItemHeader(props: {
  name: string;
  category: ItemCategory;
  sourceType: InwardSource;
  status: ItemStatus;
  itemStatusVariant: Record<
    ItemStatus,
    "primary" | "warning" | "error" | "info" | "neutral"
  >;
}) {
  const { category, itemStatusVariant, name, sourceType, status } = props;
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      {/* Back navigation */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 -ml-1"
        onClick={() => navigate("/app/items")}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Items
      </Button>

      {/* Main header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate text-foreground">
            {name}
          </h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <span className="bg-muted px-2 py-0.5 rounded-md font-medium">
              {formatEnum(category)}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="bg-muted px-2 py-0.5 rounded-md font-medium">
              {formatEnum(sourceType)}
            </span>
          </div>
        </div>

        <StatusBadge
          label={formatEnum(status)}
          variant={itemStatusVariant[status]}
        />
      </div>
    </div>
  );
}

export default ItemHeader;
