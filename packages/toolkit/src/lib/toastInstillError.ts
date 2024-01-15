import { UseToastReturn } from "@instill-ai/design-system";
import { isAxiosError } from "axios";
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
  if (isAxiosError(error)) {
    toast({
      title,
      variant: "alert-error",
      size: "large",
      description: getInstillApiErrorMessage(error),
      duration: 15000,
    });
  } else {
    toast({
      title,
      variant: "alert-error",
      size: "large",
      duration: 15000,
    });
  }
}
