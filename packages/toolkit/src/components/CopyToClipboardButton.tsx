import * as React from "react";
import cn from "clsx";
import { Button, Icons } from "@instill-ai/design-system";

export type CopyToClipboardButtonProps = {
  text: string;
  className?: string;
  iconClassName?: string;
};

export const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
  const { className, iconClassName, text } = props;
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      className={cn("flex items-center justify-center", className)}
      variant="secondaryGrey"
      size="sm"
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      {copied ? (
        <Icons.Check
          className={cn("h-4 w-4 stroke-semantic-fg-primary", iconClassName)}
        />
      ) : (
        <Icons.Copy06
          className={cn("h-4 w-4 stroke-semantic-fg-primary", iconClassName)}
        />
      )}
    </Button>
  );
};
