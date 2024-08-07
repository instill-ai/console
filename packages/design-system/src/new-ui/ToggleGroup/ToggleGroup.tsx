import React from "react";
import * as Toggles from "@radix-ui/react-toggle-group";

import { cn } from "../../utils";

const ToggleGroupRoot = React.forwardRef<
  React.ElementRef<typeof Toggles.Root>,
  React.ComponentPropsWithoutRef<typeof Toggles.Root>
>(({ className, ...props }, ref) => (
  <Toggles.Root
    ref={ref}
    className={cn(
      "inline-flex flex-row space-x-px rounded bg-semantic-bg-line relative after:pointer-events-none after:content-[''] after:w-full after:h-full after:rounded-[inherit] after:border after:border-semantic-bg-line after:absolute after:top-0 after:left-0",
      className,
    )}
    {...props}
  />
));
ToggleGroupRoot.displayName = Toggles.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof Toggles.Item>,
  React.ComponentPropsWithoutRef<typeof Toggles.Item>
>(({ className, ...props }, ref) => (
  <Toggles.Item
    ref={ref}
    className={cn(
      "flex h-full cursor-pointer items-center justify-center bg-semantic-bg-primary px-4 py-2 text-base font-semibold",
      "first:rounded-l last:rounded-r focus:outline-none data-[state=on]:cursor-default data-[state=on]:bg-semantic-accent-bg data-[state=on]:text-semantic-accent-default",
      className,
    )}
    {...props}
  />
));
ToggleGroupItem.displayName = Toggles.Item.displayName;

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
