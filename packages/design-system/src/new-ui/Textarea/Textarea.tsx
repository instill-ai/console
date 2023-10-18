"use client";

import cn from "clsx";
import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-sm border bg-semantic-bg-primary p-2 text-sm text-semantic-fg-primary product-body-text-2-regular placeholder:text-[#1D243380] focus-visible:border-semantic-accent-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-accent-default disabled:cursor-not-allowed disabled:bg-semantic-bg-secondary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
