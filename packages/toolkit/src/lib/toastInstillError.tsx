import { Icons, toast, ToastAction } from "@instill-ai/design-system";

import { getInstillApiErrorMessage } from "./sdk-helper/getInstillApiErrorMessage";

export function toastInstillError({
  title,
  error,
  description,
  action,
  duration,
}: {
  title: string;
  error?: unknown;
  description?: string;
  action?: ToastAction;
  duration?: number;
}) {
  toast.error(title, {
    description: description ?? getInstillApiErrorMessage(error),
    duration: duration ?? 4000,
    action: action ?? (
      <div
        onClick={() => toast.dismiss()}
        className="ml-auto flex items-center justify-end cursor-pointer"
      >
        <Icons.X className="w-5 h-5 stroke-semantic-fg-secondary" />
      </div>
    ),
    className: "!bg-semantic-error-bg",
  });
}
