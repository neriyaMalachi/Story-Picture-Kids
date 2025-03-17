
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "default" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
            "border border-input bg-background hover:bg-secondary hover:text-accent-foreground": variant === "outline",
            "hover:bg-secondary hover:text-accent-foreground": variant === "ghost",
            "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90": variant === "accent",
            "h-9 px-3": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 transform rounded-md transition-transform group-hover:scale-105 group-active:scale-95" />
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
