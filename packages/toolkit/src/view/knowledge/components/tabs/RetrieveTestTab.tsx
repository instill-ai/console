import { Separator } from "@instill-ai/design-system";

import { CodeBlock } from "../../../../components";
import { CodeString } from "../../../../components/CodeString";
import { defaultCodeSnippetStyles } from "../../../../constant";
import { KnowledgeBase } from "../../../../lib/vdp-sdk/knowledge/types";

type RetrieveTestTabProps = {
  knowledgeBase: KnowledgeBase;
  isProcessed: boolean;
};

export const RetrieveTestTab = ({
  knowledgeBase,
  isProcessed,
}: RetrieveTestTabProps) => {
  const curlCommand = `curl --request GET \\
     --url https://api.instill.tech/v1alpha/XXX \\
     --header 'Authorization: Bearer $INSTILL_API_TOKEN' \\
     --header 'accept: application/json'
     --data '{
       "kb": "${knowledgeBase.name}",
       "topK": 5,
       "query": "Please put your query sentence here"
}'`;
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </h1>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {!isProcessed ? (
        <div className="w-2/3 rounded bg-semantic-bg-base-bg p-6 border border-semantic-bg-line">
          <p className="mb-4 product-body-text-3-regular">
            Your knowledge base has been successfully created. Now, you can
            proceed to the{" "}
            <a
              href="link-to-upload"
              className="text-semantic-accent-default underline"
            >
              Upload Documents page
            </a>{" "}
            to upload and process your files.
          </p>
        </div>
      ) : (
        <div className="w-2/3 rounded bg-semantic-bg-base-bg p-6 border border-semantic-bg-line">
          <p className="mb-4 product-body-text-3-regular">
            Once the status of documents in Catalog / Files has changed to
            &apos;Completed&apos;, you can use the following Instill API format example to
            test the retrieval of this knowledge base and obtain chunks related
            to a given query.
          </p>
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
            <CodeString>https://api.instill.tech/v1alpha/XXX</CodeString>
          </div>
          <p className="mt-4 product-body-text-3-regular">
            For a more detailed overview of the input/output schemas, check out
            the{" "}
            <a
              href="https://www.instill.tech/docs/artifact/XXX"
              className="text-semantic-accent-default underline"
            >
              Artifact&apos;s API reference
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default RetrieveTestTab;
