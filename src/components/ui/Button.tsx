import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/clsx";

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors",
        ghost:
          "bg-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-800 hover:ring-gray-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = function ({
  className,
  isLoading,
  children,
  variant,
  size,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
