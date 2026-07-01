import { StatusBadge } from "@/components/common/StatusBadge";
import { formatEnum } from "@/utils/format";
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

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{name}</h1>

        <div className="mt-3 flex items-center gap-2 text-base text-muted-foreground">
          <span>{formatEnum(category)}</span>
          <span>•</span>
          <span>{formatEnum(sourceType)}</span>
        </div>
      </div>

      <StatusBadge
        label={formatEnum(status)}
        variant={itemStatusVariant[status]}
      />
    </div>
  );
}

export default ItemHeader;
