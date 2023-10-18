"use client";
// ref: https://ui.shadcn.com/docs/components/toast

import { Icons } from "../Icons";
import { Toast, ToastProps } from "./Toast";
import { ToasterToast, useToast } from "./use-toast";

export type ToasterProps = {
  additionalViewPortClassName?: string;
};

export function Toaster(props: ToasterProps) {
  const { additionalViewPortClassName } = props;
  const { toasts } = useToast();

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map(function ({
        id,
        title,
        size,
        description,
        action,
        icon,
        variant,
        ...props
      }) {
        const isAlert = variant?.includes("alert");

        if (variant === "notification-icon" && !icon) {
          throw new Error(
            "Toaster: variant `notification-icon` requires `icon` prop"
          );
        }

        if (isAlert) {
          return (
            <Toast.Core size={size} variant={variant} key={id} {...props}>
              {size === "large" ? (
                <div className="flex w-full flex-col space-y-1">
                  <div className="flex w-full flex-row space-x-2">
                    {getToasterIcon(variant, icon)}
                    <div className="my-auto flex flex-grow">
                      {title && <Toast.Title>{title}</Toast.Title>}
                    </div>
                    <Toast.Close />
                  </div>
                  <div className="flex w-full flex-col space-y-4 pl-8">
                    {description && (
                      <Toast.Description>{description}</Toast.Description>
                    )}
                    {action}
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-row space-x-2">
                  {getToasterIcon(variant, icon)}
                  <div className="my-auto flex-grow">
                    {title && <Toast.Title>{title}</Toast.Title>}
                  </div>
                  <Toast.Close />
                </div>
              )}
            </Toast.Core>
          );
        }

        return (
          <Toast.Core size={size} variant={variant} key={id} {...props}>
            {size === "large" ? (
              <div className="flex w-full flex-row space-x-4">
                {getToasterIcon(variant, icon)}
                <div className="flex flex-grow flex-col">
                  <div className="mb-4 flex flex-col space-y-1">
                    {title && <Toast.Title>{title}</Toast.Title>}
                    {description && (
                      <Toast.Description>{description}</Toast.Description>
                    )}
                  </div>
                  {action}
                </div>
                <div className="mb-auto">
                  <Toast.Close />
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-row space-x-2">
                {getToasterIcon(variant, icon)}
                <div className="my-auto flex-grow">
                  {title && <Toast.Title>{title}</Toast.Title>}
                </div>
                <Toast.Close />
              </div>
            )}
          </Toast.Core>
        );
      })}
      <Toast.Viewport className={additionalViewPortClassName} />
    </Toast.Provider>
  );
}

function getToasterIcon(
  variant: ToastProps["variant"],
  icon?: ToasterToast["icon"]
) {
  if (variant?.includes("success")) {
    return (
      <Icons.CheckCircle className="h-6 w-6 stroke-semantic-success-on-bg" />
    );
  }

  if (variant?.includes("warning")) {
    return (
      <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
    );
  }

  if (variant?.includes("error")) {
    return (
      <Icons.AlertCircle className="h-6 w-6 stroke-semantic-error-on-bg" />
    );
  }

  if (variant?.includes("icon")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-semantic-bg-line">
        {icon}
      </div>
    );
  }

  return <Icons.InfoCircle className="h-6 w-6 stroke-semantic-accent-on-bg" />;
}
