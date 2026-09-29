import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "../types/order";

const formatCurrency = (value: number) => `₹${Number(value).toLocaleString()}`;

export default function FinancialSummaryCard({ order }: { order: Order }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Financial Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />

        <SummaryRow
          label="Discount"
          value={`- ${formatCurrency(order.totalDiscount)}`}
        />

        <SummaryRow label="Tax" value={formatCurrency(order.totalTax)} />

        <div className="border-t border-dashed my-4" />

        <div className="bg-primary/5 rounded-lg p-3.5 flex items-center justify-between border border-primary/10">
          <span className="font-bold text-foreground text-sm">
            Total Amount
          </span>
          <span className="text-2xl font-black text-primary tracking-tight">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function SummaryRow({ label, value, highlight = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          highlight ? "font-semibold text-base" : "text-muted-foreground"
        }
      >
        {label}
      </span>

      <span className={highlight ? "text-xl font-bold" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}
