import { Icons, toast, ToastAction } from "@instill-ai/design-system";

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
    action: action ?? (
      <div
        onClick={() => toast.dismiss()}
        className="ml-auto flex items-center justify-end cursor-pointer"
      >
        <Icons.X className="w-5 h-5 stroke-semantic-fg-secondary" />
      </div>
    ),
    className: "!bg-semantic-success-bg",
    duration: 100000000,
  });
}
