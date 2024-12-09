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
      "inline-flex flex-row h-10 space-x-1 rounded-sm bg-semantic-bg-secondary relative border-2 border-semantic-bg-line",
      className,
    )}
    {...props}
    style={{ padding: '3px' }}
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
      "transition-all duration-200 ease-in-out",
      "flex h-full cursor-pointer items-center justify-center text-base text-semantic-fg-disabled product-body-text-3-semibold rounded px-2.5 py-1.5 hover:bg-semantic-bg-line",
      "focus:outline-none data-[state=on]:shadow data-[state=on]:text-semantic-fg-primary data-[state=on]:bg-semantic-bg-primary data-[state=on]:pointer-events-none data-[state=on]:cursor-default",
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
