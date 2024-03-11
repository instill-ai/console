"use client";

// ref: https://ui.shadcn.com/docs/components/toast

import cn from "clsx";
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { Icons } from "../Icons";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col space-y-5 p-4 sm:bottom-auto sm:left-1/2 sm:top-0 sm:-translate-x-1/2 sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// The swipe duplicated element issue will only happen in Storybook

const toastMainStyle = cn(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-sm shadow-lg transition-all",
  "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
  "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  "data-[swipe=cancel]:translate-x-0",
  "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:animate-out"
);

const toastVariants = cva(toastMainStyle, {
  variants: {
    variant: {
      "notification-icon": "bg-semantic-bg-primary",
      "notification-info": "bg-semantic-bg-primary",
      "notification-success": "bg-semantic-bg-primary",
      "notification-error": "bg-semantic-bg-primary",
      "notification-warning": "bg-semantic-bg-primary",
      "alert-info": "bg-semantic-accent-bg",
      "alert-success": "bg-semantic-success-bg",
      "alert-warning": "bg-semantic-warning-bg",
      "alert-error": "bg-semantic-error-bg",
    },
    size: {
      small: "px-2 py-2.5",
      large: "p-4",
    },
  },
});

const ToastCore = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, size, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      {...props}
    />
  );
});
ToastCore.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action ref={ref} className={className} {...props} />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "rounded active:ring-1 active:ring-semantic-bg-line",
      className
    )}
    toast-close=""
    {...props}
  >
    <Icons.X className="h-6 w-6 stroke-semantic-bg-secondary-alt-primary hover:stroke-semantic-bg-secondary-secondary" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-semantic-fg-primary product-body-text-2-semibold",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-semantic-fg-secondary product-body-text-3-regular",
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastCore>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Core: ToastCore,
  Action: ToastAction,
  Close: ToastClose,
  Title: ToastTitle,
  Description: ToastDescription,
};

export type { ToastProps, ToastActionElement };
