import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";

interface FormSelectProps {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

const FormSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  FormSelectProps
>(
  (
    { label, error, success, helperText, required, placeholder, ...props },
    ref
  ) => {
    const id = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
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

        <SelectPrimitive.Root {...props}>
          <SelectPrimitive.Trigger
            id={id}
            data-slot="form-select-trigger"
            className={cn(
              "w-full h-12 px-4 py-2.5",
              "text-base font-normal",
              "rounded-lg border-2 transition-all duration-200",
              "bg-input-background",
              "focus:outline-none",
              // Default state
              !error && !success && "border-border focus:border-primary focus:ring-2 focus:ring-primary/30",
              // Error state
              error && "border-destructive bg-destructive/5 focus:ring-destructive/20",
              // Success state
              success && !error && "border-green-500 focus:border-green-500 focus:ring-green-500/30",
              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Mobile touch target
              "min-h-12",
              "flex items-center justify-between"
            )}
            aria-invalid={!!error}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDownIcon className="h-5 w-5 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              data-slot="form-select-content"
              className={cn(
                "relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-background shadow-lg",
                "animate-fade-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
              )}
              position="popper"
              sideOffset={8}
            >
              <SelectPrimitive.ScrollUpButton className="flex cursor-pointer items-center justify-center py-1" />
              <SelectPrimitive.Viewport className="p-1">
                {props.children}
              </SelectPrimitive.Viewport>
              <SelectPrimitive.ScrollDownButton className="flex cursor-pointer items-center justify-center py-1" />
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {error && (
          <p
            className="text-destructive text-sm font-medium mt-2 flex items-center gap-1 animate-fade-in"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-muted-foreground text-sm mt-2">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

interface FormSelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

const FormSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  FormSelectItemProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-2 px-3 text-sm outline-none transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "min-h-10 sm:min-h-9",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemIndicator asChild>
      <CheckIcon className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText />
  </SelectPrimitive.Item>
));

FormSelectItem.displayName = "FormSelectItem";

export { FormSelect, FormSelectItem };
