import * as React from "react";
import { FormInput } from "./ui/form-input";
import { FormSelect, FormSelectItem } from "./ui/form-select";
import { FormError } from "./ui/form-error";
import { cn } from "./ui/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, error, success, helperText, required, className, children },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("space-y-2 w-full", className)}>
        {children}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// Preset component for common text field
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ containerClassName, ...props }, ref) => (
    <FormInput ref={ref} {...props} />
  )
);

TextField.displayName = "TextField";

// Preset component for email field
interface EmailFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
}

const EmailField = React.forwardRef<HTMLInputElement, EmailFieldProps>(
  (props, ref) => (
    <FormInput
      ref={ref}
      type="email"
      label="Email"
      placeholder="usuario@ejemplo.com"
      {...props}
    />
  )
);

EmailField.displayName = "EmailField";

// Preset component for phone field
interface PhoneFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
}

const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(
  (props, ref) => (
    <FormInput
      ref={ref}
      type="tel"
      label="Teléfono"
      placeholder="+506 XXXX XXXX"
      {...props}
    />
  )
);

PhoneField.displayName = "PhoneField";

// Preset component for password field
interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => (
    <FormInput
      ref={ref}
      type="password"
      label="Contraseña"
      placeholder="••••••••"
      {...props}
    />
  )
);

PasswordField.displayName = "PasswordField";

interface SelectFieldProps
  extends React.ComponentPropsWithoutRef<typeof FormSelect> {
  containerClassName?: string;
}

const SelectField = React.forwardRef<
  React.ElementRef<typeof FormSelect>,
  SelectFieldProps
>(({ containerClassName, ...props }, ref) => (
  <FormSelect ref={ref} {...props} />
));

SelectField.displayName = "SelectField";

export {
  FormField,
  TextField,
  EmailField,
  PhoneField,
  PasswordField,
  SelectField,
  FormError,
};
