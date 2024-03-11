"use client";

import cn from "clsx";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group inline-flex items-center justify-center transition-colors rounded focus:outline-none focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-semantic-accent-default text-semantic-fg-on-default hover:bg-semantic-accent-hover active:bg-semantic-accent-pressed focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-semantic-accent-hover disabled:bg-semantic-bg-secondary disabled:text-semantic-fg-disabled",
        danger:
          "bg-semantic-error-default text-semantic-fg-on-default hover:bg-semantic-error-hover active:bg-semantic-error-pressed focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-semantic-error-hover disabled:bg-semantic-bg-secondary disabled:text-semantic-fg-disabled",
        secondaryColour:
          "bg-semantic-accent-bg text-semantic-accent-hover hover:bg-semantic-accent-bg-alt active:bg-[#BED3FE] focus-visible:ring-2 focus-visible:ring-offset-1 hover:text-accent-pressed focus-visible:ring-[#91B5FD] disabled:bg-semantic-bg-secondary disabled:text-semantic-fg-disabled",
        secondarySuccess:
          "bg-semantic-success-bg text-semantic-success-default hover:bg-semantic-success-bg-alt active:bg-[#8df2ba] focus-visible:ring-2 focus-visible:ring-offset-1 hover:text-success-pressed focus-visible:ring-[#91B5FD] disabled:bg-semantic-bg-secondary disabled:text-semantic-fg-disabled",
        secondaryGrey:
          "bg-semantic-bg-primary text-semantic-fg-primary border border-semantic-bg-line hover:bg-semantic-bg-secondary hover:border-semantic-bg-secondary-secondary active:bg-semantic-bg-line focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:border-semantic-bg-secondary-secondary focus-visible:ring-semantic-bg-secondary-secondary disabled:bg-semantic-bg-secondary disabled:text-semantic-fg-disabled",
        tertiaryGrey:
          "bg-transparent text-semantic-fg-secondary hover:bg-semantic-bg-base-bg focus-visible:ring-0 disabled:text-semantic-fg-disabled disabled:bg-semantic-bg-secondary",
        tertiaryColour:
          "bg-transparent text-semantic-accent-default hover:bg-semantic-accent-bg focus-visible:ring-0 disabled:text-semantic-fg-disabled disabled:bg-semantic-bg-secondary",
        tertiaryDanger:
          "bg-transparent text-semantic-error-default hover:bg-semantic-error-bg focus-visible:ring-0 disabled:text-semantic-fg-disabled disabled:bg-semantic-bg-secondary",
        white:
          "bg-transparent border border-semantic-bg-secondary-alt-primary text-semantic-fg-on-default hover:border-semantic-bg-primary active:bg-semantic-bg-primary active:text-semantic-fg-primary focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-semantic-bg-primary disabled:border-semantic-bg-secondary-alt-primary disabled:text-semantic-fg-disabled-on-secondary-bg",
      },
      size: {
        sm: "px-2 py-[6px] product-button-button-3",
        md: "px-3 py-[9px] product-button-button-2",
        lg: "px-4 py-3 product-button-button-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
