import { UseToastReturn } from "@instill-ai/design-system";

import { getInstillApiErrorMessage } from "./vdp-sdk";

export function toastInstillError({
  title,
  toast,
  error,
}: {
  title: string;
  toast: UseToastReturn["toast"];
  error: unknown;
}) {
  toast({
    title,
    variant: "alert-error",
    size: "large",
    description: getInstillApiErrorMessage(error),
    duration: 15000,
  });
}
