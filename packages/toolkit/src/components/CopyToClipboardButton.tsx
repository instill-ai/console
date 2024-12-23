"use client";

import * as React from "react";

import { Button, cn, Icons } from "@instill-ai/design-system";

export const CopyToClipboardButton = ({
  className,
  iconClassName,
  text,
  disableCopy,
}: {
  text: string;
  className?: string;
  iconClassName?: string;
  disableCopy?: boolean;
}) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      className={cn(
        "flex items-center justify-center gap-x-1 !border !px-2 font-semibold",
        className,
      )}
      variant="secondaryGrey"
      size="md"
      type="button"
      disabled={disableCopy}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      {copied ? (
        <React.Fragment>
          <Icons.Check
            className={cn("h-4 w-4 stroke-semantic-fg-primary", iconClassName)}
          />
          <span className="text-sm">Copied!</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Icons.Copy06
            className={cn("h-4 w-4 stroke-semantic-fg-primary", iconClassName)}
          />
          <span className="text-sm">Copy</span>
        </React.Fragment>
      )}
    </Button>
  );
};
