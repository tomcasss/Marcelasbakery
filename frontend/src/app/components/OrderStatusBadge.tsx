import { cn } from "./ui/utils";

type OrderStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; icon: string; color: string; bgColor: string }> = {
  pending: {
    label: "Pendiente",
    icon: "⏳",
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
  },
  confirmed: {
    label: "Confirmado",
    icon: "✓",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  },
  "in-progress": {
    label: "En Preparación",
    icon: "⚙️",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
  },
  completed: {
    label: "Completado",
    icon: "✓✓",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  },
  cancelled: {
    label: "Cancelado",
    icon: "✕",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  animated?: boolean;
}

export function OrderStatusBadge({ status, animated = true }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
        "transition-all duration-200",
        config.bgColor,
        config.color,
        animated && status === "pending" && "animate-pulse-glow",
        animated && status === "in-progress" && "animate-pulse-slow",
      )}
    >
      <span className="text-base">{config.icon}</span>
      {config.label}
    </span>
  );
}
