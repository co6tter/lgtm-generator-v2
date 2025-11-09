import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-md font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400",
    secondary:
      "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50 active:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
