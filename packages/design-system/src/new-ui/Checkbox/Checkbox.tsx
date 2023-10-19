"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import cn from "clsx";
import { Icons } from "../Icons";

const checkboxStyle = cn(
  "shrink-0 rounded border border-semantic-fg-secondary bg-semantic-bg-primary",
  "hover:border-semantic-accent-hover hover:bg-semantic-accent-bg hover:data-[state=checked]:bg-semantic-accent-hover hover:data-[state=checked]:border-semantic-accent-hover",
  "data-[state=checked]:bg-semantic-accent-default data-[state=checked]:border-semantic-accent-default",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-semantic-accent-default focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:!bg-semantic-bg-secondary disabled:!border-semantic-bg-line"
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    checkedElement?: React.ReactElement;
  }
>(({ className, checkedElement, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxStyle, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      asChild={checkedElement ? true : false}
      className="flex items-center justify-center text-current"
    >
      {checkedElement ? (
        checkedElement
      ) : (
        <Icons.Check
          className={cn("stroke-semantic-bg-primary", {
            "stroke-semantic-fg-disabled": props.disabled,
          })}
        />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
