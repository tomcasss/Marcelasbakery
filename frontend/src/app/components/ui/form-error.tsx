import * as React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "./utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  type?: "error" | "success" | "info";
  showIcon?: boolean;
}

const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ message, type = "error", showIcon = true, className, ...props }, ref) => {
    if (!message) return null;

    const iconMap = {
      error: <AlertCircle className="h-5 w-5" />,
      success: <CheckCircle2 className="h-5 w-5" />,
      info: <Info className="h-5 w-5" />,
    };

    const colorMap = {
      error: "text-destructive bg-destructive/5 border-destructive/30",
      success: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
      info: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    };

    return (
      <div
        ref={ref}
        role={type === "error" ? "alert" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all animate-fade-in",
          colorMap[type],
          className
        )}
        {...props}
      >
        {showIcon && <span className="shrink-0">{iconMap[type]}</span>}
        <span className="flex-1">{message}</span>
      </div>
    );
  }
);

FormError.displayName = "FormError";

export { FormError };
