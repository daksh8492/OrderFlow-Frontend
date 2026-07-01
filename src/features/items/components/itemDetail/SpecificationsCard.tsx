import React from "react";
import type { Variant } from "../../types/item";

function SpecificationsCard(props: { selectedVariant: Variant | undefined }) {
  const { selectedVariant } = props;

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Specifications</h2>
      </div>

      <div className="divide-y">
        {selectedVariant &&
          Object.entries(selectedVariant.attributes).map(([key, value]) => (
            <PropertyRow key={key} label={key} value={value} />
          ))}
      </div>
    </div>
  );
}

function PropertyRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: React.ReactNode;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div
        className={
          emphasize ? "text-lg font-semibold" : "font-medium text-right"
        }
      >
        {value}
      </div>
    </div>
  );
}

export default SpecificationsCard;
