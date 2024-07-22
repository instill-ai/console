import * as React from "react";
import { Button, Icons, Separator } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { CodeBlock } from "../../../components";
import { CodeString } from "../../../components/CodeString";
import { defaultCodeSnippetStyles } from "../../../constant";

type RetrieveTestTabProps = {
  knowledgeBase: KnowledgeBase;
};

export const RetrieveTestTab = ({ knowledgeBase }: RetrieveTestTabProps) => {
  const curlCommand = `curl -X POST \\
  https://api.instill.tech/knowledge-bases/${knowledgeBase.kbId}/query \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "query": "Your question here",
    "top_k": 5
  }'`;

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="w-2/3 rounded bg-semantic-bg-base-bg p-6 border border-semantic-bg-line">
        <p className="mb-2 product-body-text-3-semibold">Knowledge base created. Time to query.</p>
        <p className="mb-4 product-body-text-3-regular">
          Check out the &nbsp;
          <span className="text-semantic-accent-default underline">
            guide to querying your knowledge base
          </span>
          &nbsp;
          for next steps, then run this command to query your knowledge base:
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
          codeString={curlCommand}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
      </div>
      <div className="mt-8">
        <p className="mb-2 text-lg font-semibold">API Endpoint:</p>
        <CodeString>
          https://api.instill.tech/knowledge-bases/{knowledgeBase.kbId}/query
        </CodeString>
      </div>
    </div>
  );
};

export default RetrieveTestTab;