import * as React from "react";
import cn from "clsx";
import { Icons } from "@instill-ai/design-system";

export const ShareButton = ({
  className,
  text,
}: {
  text: string;
  className?: string;
}) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      className={cn(
        "flex flex-row items-center gap-x-1 rounded px-1 py-0.5 hover:bg-semantic-bg-base-bg",
        className
      )}
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      <p className="font-sans text-[10px] font-semibold text-semantic-fg-disabled">
        Share
      </p>
      <Icons.Share07 className="h-3 w-3 stroke-semantic-fg-disabled" />
    </button>
  );
};
