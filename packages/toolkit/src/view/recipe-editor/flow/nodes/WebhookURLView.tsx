"use client";

import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import { CopiedTooltip } from "../../../../components";

export const WebhookURLView = ({ url }: { url: string }) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="flex flex-col py-4 w-full h-full">
      <div className="m-auto flex mx-auto flex-col p-5 gap-y-5 bg-semantic-secondary-bg">
        <div className="flex flex-col gap-y-2">
          <h3 className="w-full product-headings-heading-2 text-semantic-fg-primary text-center">
            Your Webhook URL
          </h3>
          <p className="w-[367px] product-body-text-3-regular text-semantic-fg-secondary text-center">
            You’ll need to configure your application with this Instill VDP
            webhook URL.
          </p>
        </div>
        <div className="flex flex-row gap-x-4">
          <div className="flex flex-row py-1.5 px-[9px] rounded gap-x-2 bg-semantic-bg-primary border border-semantic-bg-line">
            <Icons.Lightning02 className="my-auto w-4 h-4 stroke-[#1D2433CC]" />
            <p className="w-[229px] product-body-text-3-regular line-clamp-1 text-[#1D2433CC]">
              {url}
            </p>
          </div>
          <CopiedTooltip isOpen={copied}>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
              variant="primary"
              className="gap-x-2"
            >
              Copy
              {copied ? (
                <Icons.Check className="w-[14px] h-[14px] stroke-semantic-bg-primary" />
              ) : (
                <Icons.Copy06 className="w-[14px] h-[14px] stroke-semantic-bg-primary" />
              )}
            </Button>
          </CopiedTooltip>
        </div>
      </div>
    </div>
  );
};
