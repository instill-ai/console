import { Icons, toast, ToastAction } from "@instill-ai/design-system";

import { TOAST_DEFAULT_DURATION } from "./toastInstillError";

export function toastInstillSuccess({
  title,
  description,
  action,
  duration,
}: {
  title: string;
  description?: string;
  action?: ToastAction;
  duration?: number;
}) {
  toast.success(title, {
    description,
    action: action ?? (
      <div
        onClick={() => toast.dismiss()}
        className="ml-auto flex items-center justify-end cursor-pointer"
      >
        <Icons.X className="w-5 h-5 stroke-semantic-fg-secondary" />
      </div>
    ),
    className: "!bg-semantic-success-bg",
    duration: duration ?? TOAST_DEFAULT_DURATION,
  });
}
