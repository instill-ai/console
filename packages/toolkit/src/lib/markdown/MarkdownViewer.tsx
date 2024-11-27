"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import sanitizeHtml from "sanitize-html";

import { cn } from "@instill-ai/design-system";

import { preprocessLaTeX } from "./preprocessLatex";

export const MarkdownViewer = ({
  className,
  markdown,
}: {
  className?: string;
  markdown: string;
}) => {
  const sanitizedHtmlText = sanitizeHtml(markdown ?? "");

  const processedText = preprocessLaTeX(sanitizedHtmlText);

  const remarkPlugins = [
    remarkGfm,
    [remarkMath, { singleDollarTextMath: true }],
  ];

  const rehypePlugins = [[rehypeKatex, { output: "mathml" }]];

  return (
    <React.Fragment>
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
      <article
        className={cn(
          "markdown-body w-full overflow-x-scroll rounded-b-sm px-1.5 py-1",
          className,
        )}
      >
        <ReactMarkdown
          /* @ts-expect-error remark and rehype has type conflicts */
          remarkPlugins={remarkPlugins}
          /* @ts-expect-error remark and rehype has type conflicts */
          rehypePlugins={rehypePlugins}
        >
          {processedText}
        </ReactMarkdown>
      </article>
    </React.Fragment>
  );
};
