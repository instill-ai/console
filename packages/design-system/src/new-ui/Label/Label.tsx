"use client";

import cn from "clsx";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "flex text-semantic-fg-primary product-body-text-2-regular",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;
