import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gray-1000 text-background-100 hover:bg-gray-900 disabled:bg-gray-alpha-400",
  secondary:
    "bg-gray-alpha-100 text-gray-1000 border border-gray-alpha-400 hover:bg-gray-alpha-200",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-alpha-100",
  danger: "bg-transparent text-red-700 hover:bg-red-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-5 text-base gap-2 rounded-[var(--radius-md)]",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}>
      {isLoading ? <Spinner size={size === "lg" ? "md" : "sm"} /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
