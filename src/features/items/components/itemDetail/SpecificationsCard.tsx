import type { Variant } from "../../types/item";
import { SlidersHorizontal } from "lucide-react";

/** Formats a raw attribute key like "COLOR_TYPE" → "Color Type" */
function formatAttributeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function SpecificationsCard(props: { selectedVariant: Variant | undefined }) {
  const { selectedVariant } = props;

  const entries = selectedVariant
    ? Object.entries(selectedVariant.attributes)
    : [];

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-5 py-3.5">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Specifications</h2>
        {entries.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {entries.length} {entries.length === 1 ? "attribute" : "attributes"}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex h-24 flex-col items-center justify-center gap-1.5 text-center p-4">
          <p className="text-xs font-medium text-muted-foreground">No specifications defined</p>
          <p className="text-[10px] text-muted-foreground/70">
            Add attributes when editing this variant.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {formatAttributeKey(key)}
              </span>
              <span className="text-xs font-semibold text-foreground text-right ml-4 max-w-[60%] truncate">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpecificationsCard;
