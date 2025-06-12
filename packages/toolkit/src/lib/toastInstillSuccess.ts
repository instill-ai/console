import { toast, ToastAction } from "@instill-ai/design-system";

export function toastInstillSuccess({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ToastAction;
}) {
  toast.success(title, {
    description,
    action,
  });
}
