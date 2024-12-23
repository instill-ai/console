"use client";

import type { Nullable } from "instill-sdk";
import * as React from "react";
import sanitizeHtml from "sanitize-html";

import { cn, Switch } from "@instill-ai/design-system";

import { MarkdownViewer } from "../../../markdown";
import { CopyButton } from "./CopyButton";

export const MDTextViewer = ({
  text,
  forceFormatted,
}: {
  text: Nullable<string>;
  forceFormatted?: boolean;
}) => {
  const [enableFormattedText, setEnableFormattedText] = React.useState(
    forceFormatted ?? false,
  );

  const sanitizedHtmlText = sanitizeHtml(text ?? "");

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

        .markdown-body ul > li {
          white-space: pre-wrap !important;
        }

        .markdown-body ol > li {
          white-space: pre-wrap !important;
        }

        .markdown-body h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          white-space: pre-wrap !important;
        }
      `}</style>
      <div className="nodrag nowheel flex flex-col rounded-sm border border-semantic-bg-line">
        <div className="flex flex-row rounded-t-sm border-b border-semantic-bg-line bg-semantic-bg-secondary px-2 py-1">
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
          <div className="ml-auto flex flex-row">
            <CopyButton className="my-auto" text={sanitizedHtmlText} />
          </div>
        </div>
        <div>
          <MarkdownViewer
            className={enableFormattedText ? "" : "hidden"}
            markdown={sanitizedHtmlText}
          />
          <pre
            className={cn(
              "flex w-full flex-1 items-center whitespace-pre-line break-all px-1.5 py-1 text-semantic-fg-primary product-body-text-4-regular",
              enableFormattedText ? "hidden" : "",
            )}
          >
            {sanitizedHtmlText}
          </pre>
        </div>
      </div>
    </React.Fragment>
  );
};
