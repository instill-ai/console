"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

import { Icons } from "../Icons";

export const SonnerToaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      icons={{
        success: (
          <Icons.CheckCircle className="h-5 w-5 stroke-semantic-success-on-bg" />
        ),
        info: (
          <Icons.InfoCircle className="h-5 w-5 stroke-semantic-accent-on-bg" />
        ),
        error: (
          <Icons.AlertCircle className="h-5 w-5 stroke-semantic-error-on-bg" />
        ),
        warning: (
          <Icons.AlertTriangle className="h-5 w-5 stroke-semantic-warning-on-bg" />
        ),
      }}
      {...props}
      toastOptions={{
        classNames: {
          success:
            "!bg-semantic-bg-primary !gap-x-3 !p-2.5 !flex-row !items-center",
          error:
            "!bg-semantic-bg-primary !gap-x-3 !p-2.5 !flex-row !items-center",
          warning:
            "!bg-semantic-bg-primary !gap-x-3 !p-2.5 !flex-row !items-center",
          info: "!bg-semantic-bg-primary !gap-x-3 !p-2.5 !flex-row !items-center",
          icon: "!w-5 !h-5 mx-0",
        },
      }}
    />
  );
};
