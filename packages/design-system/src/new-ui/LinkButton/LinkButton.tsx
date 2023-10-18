import cn from "clsx";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const linkButtonVariants = cva(
  "group inline-flex items-center justify-center py-1 transition-colors !underline underline-offset-4 !decoration-1 focus:outline-none focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "text-semantic-accent-default hover:text-semantic-accent-hover hover:!decoration-2 hover:!decoration-semantic-accent-hover active:!text-semantic-accent-pressed active:!decoration-2 active:!decoration-semantic-accent-pressed focus-visible:bg-semantic-accent-bg focus-visible:!decoration-2 focus-visible:decoration-semantic-accent-hover disabled:!no-underline disabled:text-semantic-fg-disabled",
        danger:
          "text-semantic-error-default hover:text-semantic-error-hover hover:!decoration-2 hover:!decoration-semantic-error-hover active:!text-semantic-error-pressed active:!decoration-2 active:!decoration-semantic-error-pressed focus-visible:bg-semantic-error-bg focus-visible:!decoration-2 focus-visible:decoration-semantic-error-hover disabled:!no-underline disabled:text-semantic-fg-disabled",
        secondary:
          "text-semantic-bg-secondary-alt-primary hover:text-semantic-bg-secondary-secondary hover:!decoration-2 hover:!decoration-semantic-bg-secondary-secondary active:text-semantic-bg-secondary-primary active:!decoration-2 active:!decoration-semantic-bg-secondary-primary focus-visible:bg-semantic-bg-base-bg focus-visible:!decoration-2 focus-visible:decoration-semantic-bg-secondary-secondary disabled:!no-underline disabled:text-semantic-fg-disabled",
        white:
          "text-semantic-fg-secondary-on-bg-secondary hover:text-semantic-fg-on-default hover:!decoration-2 hover:!decoration-semantic-fg-on-default active:text-semantic-fg-on-default active:!decoration-2 active:!decoration-semantic-fg-on-default focus-visible:bg-semantic-bg-secondary-alt-primary focus-visible:!decoration-2 focus-visible:decoration-semantic-fg-on-default disabled:!no-underline disabled:text-semantic-fg-disabled",
      },
      size: {
        sm: "product-button-button-3",
        md: "product-button-button-2",
        lg: "product-button-button-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type LinkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof linkButtonVariants> & {
    asChild?: boolean;
  };

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(linkButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
LinkButton.displayName = "Button";

export { LinkButton, linkButtonVariants };
