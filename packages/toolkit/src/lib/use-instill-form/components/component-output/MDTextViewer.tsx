"use client";

import * as React from "react";
import cn from "clsx";
import { Switch } from "@instill-ai/design-system";
import { CopyButton } from "./CopyButton";
import { Nullable } from "../../../type";
import Markdown from "markdown-to-jsx";
import { DownloadButton } from "./DownloadButton";

export const MDTextViewer = ({ text }: { text: Nullable<string> }) => {
  const [enableFormattedText, setEnableFormattedText] = React.useState(false);

  return (
    <React.Fragment>
      {/* The anchor, code, paragraph in the MD viewer will overflow */}
      <style jsx={true}>{`
        .markdown-body a {
          word-break: break-all !important;
        }

        .markdown-body pre code {
          white-space: pre-wrap !important;
        }

        .markdown-body p {
          white-space: pre-wrap !important;
        }
      `}</style>
      <div className="nodrag nowheel flex flex-col rounded-sm border border-semantic-bg-line">
        <div className="flex flex-row rounded-t-sm border-b border-semantic-bg-line bg-[#F0F0F0] px-2 py-0">
          <div className="flex flex-row gap-x-1">
            <p className="my-auto text-semantic-fg-primary product-body-text-4-medium">
              Formatted
            </p>
            <div className="my-auto scale-75">
              <Switch
                checked={enableFormattedText}
                onCheckedChange={(e) => {
                  setEnableFormattedText(e);
                }}
                className="my-auto"
              />
            </div>
          </div>
          <div className="ml-auto flex flex-row gap-x-1">
            <DownloadButton className="my-auto" text={text ?? ""} />
            <CopyButton className="my-auto" text={text ?? ""} />
          </div>
        </div>
        <div>
          <div
            className={cn(
              "markdown-body w-full overflow-x-scroll whitespace-pre rounded-b-sm px-1.5 py-1",
              enableFormattedText ? "" : "hidden"
            )}
          >
            <Markdown>{text ?? ""}</Markdown>
          </div>
          <pre
            className={cn(
              "flex w-full flex-1 items-center whitespace-pre-line break-all px-1.5 py-1 text-semantic-fg-primary product-body-text-4-regular",
              enableFormattedText ? "hidden" : ""
            )}
          >
            {text}
          </pre>
        </div>
      </div>
    </React.Fragment>
  );
};
