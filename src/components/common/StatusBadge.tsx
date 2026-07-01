import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  variant?: "primary" | "warning" | "error" | "info" | "neutral";
};

const variants = {
  primary:
    "border-primary bg-primary/10 text-primary hover:bg-primary/10",
  warning:
    "border-warning bg-warning/10 text-warning hover:bg-warning/10",
  error:
    "border-error bg-error/10 text-error hover:bg-error/10",
  info:
    "border-info bg-info/10 text-info hover:bg-info/10",
  neutral:
    "border-border bg-muted text-muted-foreground hover:bg-muted",
};

export function StatusBadge({
  label,
  variant = "neutral",
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "pointer-events-none font-medium",
        variants[variant]
      )}
    >
      {label}
    </Badge>
  );
}