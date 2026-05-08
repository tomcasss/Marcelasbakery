import { cn } from "./ui/utils";

type PaymentStatus = "pending" | "verified" | "failed" | "refunded";

const statusConfig: Record<PaymentStatus, { label: string; icon: string; color: string; bgColor: string }> = {
  pending: {
    label: "Pendiente",
    icon: "💳",
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
  },
  verified: {
    label: "Verificado",
    icon: "✓",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  },
  failed: {
    label: "Fallido",
    icon: "✕",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  },
  refunded: {
    label: "Reembolsado",
    icon: "↶",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800",
  },
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  animated?: boolean;
}

export function PaymentStatusBadge({ status, animated = true }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
        "transition-all duration-200",
        config.bgColor,
        config.color,
        animated && status === "pending" && "animate-pulse-slow",
      )}
    >
      <span className="text-base">{config.icon}</span>
      {config.label}
    </span>
  );
}
