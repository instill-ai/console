"use client";

import cn from "clsx";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const tagVariants = cva(
  "inline-flex items-center rounded-full border font-semibold",
  {
    variants: {
      variant: {
        default: "text-semantic-fg-primary border border-semantic-bg-line",
        lightBlue: "bg-semantic-accent-bg text-semantic-accent-default",
        borderBlue:
          "text-semantic-accent-hover border border-semantic-accent-default",
        darkBlue: "bg-semantic-accent-default text-semantic-fg-on-default",
        lightRed: "bg-semantic-error-bg text-semantic-error-default",
        lightYellow: "bg-semantic-warning-bg text-semantic-warning-default",
        lightGreen: "bg-semantic-success-bg text-semantic-success-default",
        lightPurple: "bg-semantic-secondary-bg text-semantic-secondary-default",
        darkRed: "bg-semantic-error-default text-semantic-fg-on-default",
        darkYellow: "bg-semantic-warning-default text-semantic-fg-on-default",
        darkGreen: "bg-semantic-success-default text-semantic-fg-on-default",
        darkPurple: "bg-semantic-secondary-default text-semantic-fg-on-default",
        borderRed:
          "border border-semantic-error-default text-semantic-error-default",
        borderYellow:
          "border border-semantic-warning-default text-semantic-warning-default",
        borderGreen:
          "border border-semantic-success-default text-semantic-success-default",
        borderPurple:
          "border border-semantic-secondary-default text-semantic-secondary-default",
        lightNeutral: "bg-semantic-bg-secondary text-semantic-fg-secondary",
        darkNeutral:
          "bg-semantic-bg-secondary-alt-primary text-semantic-fg-on-default",
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

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
