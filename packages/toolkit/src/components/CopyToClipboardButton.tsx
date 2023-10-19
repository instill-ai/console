import * as React from "react";
import cn from "clsx";
import { Button, Icons } from "@instill-ai/design-system";

export type CopyToClipboardButtonProps = {
  text: string;
  className?: string;
};

export const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
  const { className, text } = props;
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      className={cn("flex justify-center items-center", className)}
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
        <Icons.Check className="w-4 h-4 stroke-semantic-fg-primary" />
      ) : (
        <Icons.Copy06 className="w-4 h-4 stroke-semantic-fg-primary" />
      )}
    </Button>
  );
};
