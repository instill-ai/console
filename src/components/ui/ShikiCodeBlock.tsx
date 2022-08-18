import { CheckIcon, CopyIcon } from "@instill-ai/design-system";
import copy from "copy-to-clipboard";
import { useCallback, useState } from "react";

export type ShikiCodeBlockProps = {
  source: string;
  code: string;
};

const ShikiCodeBlock = ({ source, code }: ShikiCodeBlockProps) => {
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
    <div className="relative">
      <div dangerouslySetInnerHTML={{ __html: source }} />
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

export default ShikiCodeBlock;
