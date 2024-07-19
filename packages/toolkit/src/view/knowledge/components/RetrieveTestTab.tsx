import { Button, Icons, Separator } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import * as React from "react";

type RetrieveTestTabProps = {
  knowledgeBase: KnowledgeBase;
};

const CodeBlock = ({ code }: { code: string }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative mt-2 rounded bg-semantic-bg-primary p-2.5 border border-semantic-bg-line">
      <Button
        variant="secondaryGrey"
        size="md"
        onClick={handleCopy}
        className="absolute right-2 top-2 !lowercase"
      >
        {isCopied ? (
          <Icons.Check className="h-4 w-4 stroke-semantic-fg-primary mr-2" />
        ) : (
          <Icons.Copy06 className="h-4 w-4 stroke-semantic-fg-primary mr-2" />
        )}
        copy
      </Button>
      <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const RetrieveTestTab = ({ knowledgeBase }: RetrieveTestTabProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="w-2/3 rounded bg-semantic-bg-base-bg p-6 border border-semantic-bg-line">
        <p className="mb-2 product-body-text-3-semibold">Model created. Time to push.</p>
        <p className="mb-4 product-body-text-3-regular">
          Check out the &nbsp;
          <span className="text-semantic-accent-default underline">
            guide to pushing your own model
          </span>
          &nbsp;
          for next steps, then run these commands to push it to Instill AI:
        </p>
        <div className="rounded bg-semantic-bg-secondary p-4">
          <p className="text-sm">
            Make sure to include your API key in the Authorization header and
            the query in the request body.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <p className="mb-2 text-lg font-semibold">Example cURL command:</p>
        <CodeBlock
          code={`curl -X POST \\
  https://api.instill.tech/knowledge-bases/${knowledgeBase.kbId}/query \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "query": "Your question here",
    "top_k": 5
  }'`}
        />
      </div>
    </div>
  );
};