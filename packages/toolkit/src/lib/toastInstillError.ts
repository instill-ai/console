import { toast } from "@instill-ai/design-system";

import { getInstillApiErrorMessage } from "./sdk-helper/getInstillApiErrorMessage";

export function toastInstillError({
  title,
  error,
  description,
}: {
  title: string;
  error?: unknown;
  description?: string;
}) {
  toast.error(title, {
    description: description ?? getInstillApiErrorMessage(error),
    duration: 15000,
  });
}
