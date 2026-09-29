// import { ArrowRight, CalendarDays } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { type OrderPriority, type OrderSummary } from "../types/order";
// import { useNavigate } from "react-router";
// import { StatusBadge } from "@/components/common/StatusBadge";
// import { paymentStatusVariant } from "../constants/orderConstants";

// const STATUS_STAMP: Record<
//   string,
//   { border: string; text: string; bg: string }
// > = {
//   PENDING: {
//     border: "border-amber-500/40",
//     text: "text-amber-600",
//     bg: "bg-amber-500/5",
//   },
//   PROCESSING: {
//     border: "border-blue-500/40",
//     text: "text-blue-600",
//     bg: "bg-blue-500/5",
//   },
//   PICKED: {
//     border: "border-blue-500/40",
//     text: "text-blue-600",
//     bg: "bg-blue-500/5",
//   },
//   PACKED: {
//     border: "border-indigo-500/40",
//     text: "text-indigo-600",
//     bg: "bg-indigo-500/5",
//   },
//   SHIPPED: {
//     border: "border-cyan-500/40",
//     text: "text-cyan-600",
//     bg: "bg-cyan-500/5",
//   },
//   OUT_FOR_DELIVERY: {
//     border: "border-violet-500/40",
//     text: "text-violet-600",
//     bg: "bg-violet-500/5",
//   },
//   DELIVERED: {
//     border: "border-emerald-500/40",
//     text: "text-emerald-600",
//     bg: "bg-emerald-500/5",
//   },
//   COMPLETED: {
//     border: "border-emerald-500/40",
//     text: "text-emerald-600",
//     bg: "bg-emerald-500/5",
//   },
//   CANCELLED: {
//     border: "border-rose-500/40",
//     text: "text-rose-600",
//     bg: "bg-rose-500/5",
//   },
//   FAILED: {
//     border: "border-rose-500/40",
//     text: "text-rose-600",
//     bg: "bg-rose-500/5",
//   },
//   RETURNED: {
//     border: "border-orange-500/40",
//     text: "text-orange-600",
//     bg: "bg-orange-500/5",
//   },
// };

// const DEFAULT_STAMP = {
//   border: "border-slate-400/40",
//   text: "text-slate-600",
//   bg: "bg-slate-500/5",
// };

// const PRIORITY_DOT: Record<OrderPriority, string> = {
//   URGENT: "bg-rose-600",
//   HIGH: "bg-rose-500",
//   MEDIUM: "bg-amber-500",
//   LOW: "bg-slate-400",
// };

// function OrderCard({ order }: { order: OrderSummary }) {
//   const navigate = useNavigate();

//   const currentStamp = STATUS_STAMP[order.status] ?? DEFAULT_STAMP;
//   const priorityDot = PRIORITY_DOT[order.priority] ?? "bg-slate-400";
//   const initial = order.receiverName?.trim()?.charAt(0)?.toUpperCase() || "?";

//   const handleNavigate = () => navigate(`/app/orders/${order.orderId}`);

//   return (
//     <Card
//       onClick={handleNavigate}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => {
//         if (e.key === "Enter" || e.key === " ") {
//           e.preventDefault();
//           handleNavigate();
//         }
//       }}
//       aria-label={`View details for order ${order.orderNumber}`}
//       className="group relative cursor-pointer overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
//     >
//       <div
//         className={`absolute -right-2 top-4 z-10 rotate-[8deg] rounded border-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${currentStamp.border} ${currentStamp.text} ${currentStamp.bg} transition-transform duration-300 group-hover:rotate-0`}
//       >
//         {order.status}
//       </div>

//       <div className="p-5 flex flex-col gap-4">
//         <div className="flex items-start justify-between gap-3 pr-8">
//           <div className="min-w-0">
//             <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
//               Order
//             </p>
//             <h3 className="font-mono text-lg font-bold tracking-tight truncate">
//               {order.orderNumber}
//             </h3>
//           </div>
//         </div>

//         <div className="relative flex items-center">
//           <div className="h-2 w-2 rounded-full bg-background border border-border/60 -ml-7" />
//           <div className="flex-1 border-t border-dashed border-border" />
//           <div className="h-2 w-2 rounded-full bg-background border border-border/60 -mr-7" />
//         </div>

//         <div className="flex items-center gap-2.5 -mt-1">
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-xs font-bold">
//             {initial}
//           </div>
//           <div className="min-w-0">
//             <p className="text-sm font-medium truncate">{order.receiverName}</p>
//             <div className="flex items-center gap-1 text-xs text-muted-foreground">
//               <CalendarDays size={11} />
//               <span>{new Date(order.orderDate).toLocaleDateString()}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-end justify-between rounded-lg border border-border/50 bg-muted/30 px-3.5 py-3">
//           <div className="flex flex-col gap-1">
//             <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
//               Payment
//             </p>
//             <StatusBadge
//               label={order.paymentStatus}
//               variant={paymentStatusVariant[order.paymentStatus]}
//             />
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
//               Total
//             </p>
//             <p className="text-2xl font-black leading-none tracking-tight tabular-nums">
//               ₹{Number(order.totalAmount).toLocaleString()}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-0.5">
//           <div className="flex items-center gap-1.5">
//             <span className={`h-1.5 w-1.5 rounded-full ${priorityDot}`} />
//             <span className="text-xs font-medium text-muted-foreground capitalize">
//               {order.priority.toLowerCase()} priority
//             </span>
//           </div>
//           <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
//             View Details
//             <ArrowRight size={14} />
//           </span>
//         </div>
//       </div>
//     </Card>
//   );
// }

// export default OrderCard;


import { CalendarDays, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type OrderSummary } from "../types/order";
import { useNavigate } from "react-router";
import { StatusBadge } from "@/components/common/StatusBadge";
import { paymentStatusVariant } from "../constants/orderConstants";

const ORDER_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  PROCESSING: "bg-blue-500/10 text-blue-600",
  PICKED: "bg-blue-500/10 text-blue-600",
  PACKED: "bg-indigo-500/10 text-indigo-600",
  SHIPPED: "bg-cyan-500/10 text-cyan-600",
  OUT_FOR_DELIVERY: "bg-violet-500/10 text-violet-600",
  DELIVERED: "bg-emerald-500/10 text-emerald-600",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  CANCELLED: "bg-rose-500/10 text-rose-600",
  FAILED: "bg-rose-500/10 text-rose-600",
  RETURNED: "bg-orange-500/10 text-orange-600",
};

const PRIORITY_STYLE: Record<string, string> = {
  URGENT: "bg-rose-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-slate-400",
};

function OrderCard({ order }: { order: OrderSummary }) {
  const navigate = useNavigate();

  const initial =
    order.receiverName?.trim()?.charAt(0)?.toUpperCase() || "?";

  const statusStyle =
    ORDER_STATUS_STYLE[order.status] ??
    "bg-muted text-muted-foreground";

  const priorityStyle =
    PRIORITY_STYLE[order.priority] ?? "bg-slate-400";

  return (
    <Card
      onClick={() => navigate(`/app/orders/${order.orderId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/app/orders/${order.orderId}`);
        }
      }}
      className="
        group
        cursor-pointer
        border-border/60
        bg-card
        p-0
        transition-colors
        hover:border-primary/30
        hover:bg-accent/30
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      <div className="flex min-h-[76px] items-center gap-4 px-4 py-3">
        {/* Order number */}
        <div className="w-[150px] shrink-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Order
          </p>

          <p className="truncate font-mono text-sm font-semibold">
            {order.orderNumber}
          </p>
        </div>

        {/* Customer */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {order.receiverName}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="h-3 w-3" />

              <span>
                {new Date(order.orderDate).toLocaleDateString(
                  undefined,
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                )}
              </span>

              <span>·</span>

              <span
                className={`
                  h-1.5 w-1.5 rounded-full
                  ${priorityStyle}
                `}
              />

              <span>{order.priority}</span>
            </div>
          </div>
        </div>

        {/* Order status */}
        <div className="hidden w-[130px] shrink-0 md:block">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Status
          </p>

          <span
            className={`
              inline-flex
              rounded-md
              px-2
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              ${statusStyle}
            `}
          >
            {order.status.replaceAll("_", " ")}
          </span>
        </div>

        {/* Payment */}
        <div className="hidden w-[115px] shrink-0 lg:block">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Payment
          </p>

          <StatusBadge
            label={order.paymentStatus}
            variant={paymentStatusVariant[order.paymentStatus]}
          />
        </div>

        {/* Amount */}
        <div className="w-[110px] shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Total
          </p>

          <p className="text-sm font-semibold tabular-nums">
            ₹{Number(order.totalAmount).toLocaleString()}
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight
          className="
            h-4
            w-4
            shrink-0
            text-muted-foreground/50
            transition-transform
            duration-200
            group-hover:translate-x-0.5
            group-hover:text-foreground
          "
        />
      </div>
    </Card>
  );
}

export default OrderCard;