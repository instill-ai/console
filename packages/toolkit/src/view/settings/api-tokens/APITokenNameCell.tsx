"use client";

import { Button, Icons } from "@instill-ai/design-system";
import { useState } from "react";

export type APITokenNameCellProps = {
  id: string;
  accessToken: string;
};

export const APITokenNameCell = (props: APITokenNameCellProps) => {
  const { id, accessToken } = props;
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-row">
      <div className="my-auto mr-auto flex flex-col">
        <p className="font-sans text-sm font-semibold leading-5 text-[#1D2433]">
          {id}
        </p>
        <p className="w-1/2 truncate text-sm font-normal leading-5 text-[#1D2433] text-opacity-80">
          {accessToken}
        </p>
      </div>
      <Button
        onClick={async () => {
          await navigator.clipboard.writeText(accessToken);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }}
        variant="tertiaryGrey"
        size="sm"
        className="!px-2 !py-2"
      >
        {copied ? (
          <Icons.Check className="h-4 w-4 stroke-semantic-fg-primary" />
        ) : (
          <Icons.Copy06 className="h-4 w-4 stroke-semantic-fg-primary" />
        )}
      </Button>
    </div>
  );
};
