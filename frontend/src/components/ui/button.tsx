"use client";

import * as React from "react";
import { cn } from "@/src/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-70";
    const variants = {
      primary: "bg-white text-black hover:bg-white/90",
      ghost: "bg-transparent text-neutral-200 hover:bg-neutral-800"
    } as const;
    const sizes = {
      md: "h-9 px-3 text-sm",
      sm: "h-8 px-2 text-sm"
    } as const;
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


