import cn from "clsx";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const tagButtonVariants = cva(
  "inline-flex items-center rounded-full transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-semantic-fg-primary border-opacity-0 border border-[#E1E6EF] hover:border-opacity-100 focus:border-opacity-100 hover:bg-semantic-bg-base-bg focus:bg-semantic-bg-secondary",
      },
      size: {
        sm: "px-2 py-1 product-body-text-4-medium",
        md: "px-2.5 py-1 product-body-text-3-medium",
        lg: "px-3 py-1 product-body-text-3-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type TagButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof tagButtonVariants> & {
    asChild?: boolean;
  };

const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(tagButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TagButton.displayName = "TagButton";

export { TagButton, tagButtonVariants };
