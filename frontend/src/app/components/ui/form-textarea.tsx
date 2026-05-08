import * as React from "react";
import { cn } from "./utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, success, helperText, required, ...props }, ref) => {
    const textareaId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-base font-medium mb-2 transition-colors",
              error && "text-destructive",
              success && "text-green-600",
              !error && !success && "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            data-slot="form-textarea"
            className={cn(
              "w-full px-4 py-2.5",
              "text-base font-normal",
              "rounded-lg border-2 transition-all duration-200",
              "bg-input-background placeholder:text-muted-foreground",
              "focus:outline-none",
              // Default state
              !error && !success && "border-border focus:border-primary focus:ring-2 focus:ring-primary/30",
              // Error state
              error && "border-destructive bg-destructive/5 focus:ring-destructive/20",
              // Success state
              success && !error && "border-green-500 focus:border-green-500 focus:ring-green-500/30",
              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
              // Resize
              "resize-none sm:resize-vertical",
              "min-h-24",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-destructive text-sm font-medium mt-2 flex items-center gap-1 animate-fade-in"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="text-muted-foreground text-sm mt-2"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
