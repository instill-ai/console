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

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  error: any;
}) {
  if (isAxiosError(error)) {
    toast({
      title,
      variant: "alert-error",
      size: "large",
      description: getInstillApiErrorMessage(error),
    });
  } else {
    toast({
      title,
      variant: "alert-error",
      size: "large",
    });
  }
}
