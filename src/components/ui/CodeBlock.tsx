import { CheckIcon, CopyIcon } from "@instill-ai/design-system";
import copy from "copy-to-clipboard";
import { useCallback, useState } from "react";
import Markdown from "react-markdown";
import cn from "clsx";

export type CodeBlockProps = {
  source: string;
  code: string;
  marginBottom?: string;
};

const CodeBlock = ({ source, code, marginBottom }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    try {
      copy(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.log(err);
    }
  }, [code]);

  return (
    <div className={cn("relative", marginBottom)}>
      <Markdown className="code-block">{source}</Markdown>
      <button
        onClick={handleCopy}
        type="button"
        className="absolute top-3 right-3"
      >
        {copied ? (
          <CheckIcon color="fill-instillGrey05" width="w-4" height="h-4" />
        ) : (
          <CopyIcon color="fill-instillGrey05" width="w-4" height="h-4" />
        )}
      </button>
    </div>
  );
};

export default CodeBlock;
