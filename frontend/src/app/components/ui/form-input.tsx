import * as React from "react";
import { cn } from "./utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, success, helperText, required, type = "text", ...props }, ref) => {
    const inputId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
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
          <input
            ref={ref}
            type={type}
            id={inputId}
            data-slot="form-input"
            className={cn(
              "w-full h-12 px-4 py-2.5",
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
              // Mobile touch target (48px minimum)
              "min-h-12",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {/* Success icon */}
          {success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Error icon */}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-destructive text-sm font-medium mt-2 flex items-center gap-1 animate-fade-in"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-muted-foreground text-sm mt-2"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
