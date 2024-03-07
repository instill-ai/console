"use client";

import cn from "clsx";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icons } from "../Icons";

const Root = SelectPrimitive.Root;

const Group = SelectPrimitive.Group;

const Value = SelectPrimitive.Value;

const Trigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-2 product-body-text-2-regular focus:border-semantic-accent-default focus:outline-none focus:ring-2 focus:ring-semantic-accent-default focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-[#1D2433CC]",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
Trigger.displayName = SelectPrimitive.Trigger.displayName;

const Content = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    viewportClassName?: string;
  }
>(
  (
    { className, viewportClassName, children, position = "popper", ...props },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-[320px] min-w-[8rem] overflow-y-scroll rounded-sm border bg-semantic-bg-primary text-semantic-fg-primary shadow-md animate-in fade-in-80",
          position === "popper" && "translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
            viewportClassName
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
Content.displayName = SelectPrimitive.Content.displayName;

const Label = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
Label.displayName = SelectPrimitive.Label.displayName;

const Item = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    disabledCheck?: boolean;
  }
>(({ className, disabledCheck, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex w-full cursor-pointer select-none items-center rounded stroke-semantic-fg-primary py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-semantic-accent-default focus:text-semantic-bg-primary data-[disabled]:pointer-events-none data-[highlighted]:stroke-semantic-bg-primary data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {disabledCheck ? (
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icons.Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    ) : null}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
Item.displayName = SelectPrimitive.Item.displayName;

const Separator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-semantic-bg-base-bg", className)}
    {...props}
  />
));
Separator.displayName = SelectPrimitive.Separator.displayName;

export const Select = {
  Root,
  Group,
  Value,
  Trigger,
  Content,
  Label,
  Item,
  Separator,
};
