"use client";

import cn from "clsx";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { CopyToClipboardButton } from "./CopyToClipboardButton";

export type CodeBlockProps = {
  codeString: string;
  className?: string;
  disableCopy?: boolean;
} & Omit<React.ComponentProps<typeof SyntaxHighlighter>, "style">;

export const CodeBlock = (props: CodeBlockProps) => {
  const { codeString, className, disableCopy, ...passThrough } = props;

  const iconClassName = disableCopy
    ? "stroke-semantic-fg-disabled"
    : "stroke-semantic-fg-primary";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-1 rounded-sm border bg-semantic-bg-primary",
        className,
      )}
    >
      <div className="absolute right-3 top-3">
        <CopyToClipboardButton
          className="border-0 !px-1 !py-1"
          text={codeString}
          disableCopy={disableCopy}
          iconClassName={iconClassName}
        />
      </div>
      <SyntaxHighlighter style={docco} {...passThrough}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
