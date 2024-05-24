"use client";

import cn from "clsx";
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

const RadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    indicator?: React.ReactNode;
  }
>(({ className, indicator, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 shrink-0 rounded-full border border-semantic-fg-secondary text-semantic-fg-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-semantic-accent-default disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-semantic-accent-default data-[state=checked]:bg-semantic-accent-default",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {indicator ? (
          indicator
        ) : (
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-semantic-bg-primary" />
        )}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export const RadioGroup = { Root: RadioGroupRoot, Item: RadioGroupItem };
