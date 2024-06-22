import cn from "clsx";
import { Icons } from "@instill-ai/design-system";

export const EmptyImageInputPlaceholder = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-y-4 py-10",
        className
      )}
    >
      <Icons.Upload01 className="h-8 w-8 stroke-semantic-fg-secondary [&>path]:stroke-[1.5]" />
      <p className="text-xs text-semantic-fg-primary">Pick a file to upload</p>
    </div>
  );
};
