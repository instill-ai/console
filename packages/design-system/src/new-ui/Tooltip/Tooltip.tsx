import cn from "clsx";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;
const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  // We can't use overflow-hidden class in this component. Because the arrow of the
  // tooltip will be treated as hidden by Radix-UI and will keep re-render it. So
  // there will be a short period of time the tooltip content is shown but the browser
  // just begin to paint the arrow, cause the blink issue.
  // ref: https://github.com/radix-ui/primitives/blob/eca6babd188df465f64f23f3584738b85dba610e/packages/react/tooltip/src/Tooltip.tsx#L579

  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 text-sm shadow-md will-change-auto",
      "transition duration-300",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "animate-in data-[state=delayed-open]:fade-in data-[state=delayed-open]:zoom-in-105",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {props.children}
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Provider: TooltipProvider,
  Portal: TooltipPortal,
  Arrow: TooltipArrow,
};
