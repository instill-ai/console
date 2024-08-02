import { Nullable } from "instill-sdk";

import { Separator } from "@instill-ai/design-system";

import { CodeBlock } from "../../../../components";
import { CodeString } from "../../../../components/CodeString";
import { defaultCodeSnippetStyles } from "../../../../constant";
import { KnowledgeBase } from "../../../../lib/react-query-service/knowledge/types";

type RetrieveTestTabProps = {
  knowledgeBase: KnowledgeBase;
  isProcessed: boolean;
  onGoToUpload: () => void;
  namespaceId: Nullable<string>;
};

export const RetrieveTestTab = ({
  knowledgeBase,
  isProcessed,
  onGoToUpload,
  namespaceId,
}: RetrieveTestTabProps) => {
  const kbId = knowledgeBase.catalogId;

  const curlCommand = `curl -X POST \\
'https://api.instill.tech/v1alpha/namespaces/${namespaceId}/catalogs/${kbId}/chunks/similarity' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer $INSTILL_API_TOKEN' \\
--data '{
  "textPrompt": "Please put your query sentence here",
  "topk": 5
}'`;

  const inputSchema = `{
  "type": "object",
  "properties": {
    "textPrompt": {
      "type": "string",
      "title": "text prompt"
    },
    "topk": {
      "type": "integer",
      "format": "int64",
      "title": "topk"
    }
  },
  "title": "Similar chunk search request"
}`;

  const outputSchema = `{
  "type": "object",
  "properties": {
    "similarChunks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chunkUid": {
            "type": "string",
            "title": "chunk uid"
          },
          "similarityScore": {
            "type": "number",
            "format": "float",
            "title": "similarity score"
          },
          "textContent": {
            "type": "string",
            "title": "chunk"
          },
          "sourceFile": {
            "type": "string",
            "title": "source file"
          }
        },
        "title": "similarity chunks"
      },
      "title": "chunks"
    }
  },
  "title": "Similar chunk search response"
}`;

  return (
    <div className="flex flex-col mb-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </h1>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {!isProcessed ? (
        <div className="w-2/3 rounded bg-semantic-bg-base-bg p-6 border border-semantic-bg-line">
          <p className="mb-4 product-body-text-3-regular">
            Your catalog has been successfully created. Now, you can proceed to
            the{" "}
            <button
              onClick={onGoToUpload}
              className="text-semantic-accent-default underline"
            >
              Upload Documents page
            </button>{" "}
            to upload and process your files.
          </p>
        </div>
      ) : (
        <div className="w-5/6 rounded bg-semantic-bg-base-bg p-6 border border-semantic-bg-line">
          <p className="mb-4 product-body-text-3-regular">
            Once the status of documents in Catalog / Files has changed to
            &apos;Completed&apos;, you can use the following Instill API format
            example to test the retrieval of this catalog and obtain chunks
            related to a given query.
          </p>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">
              Set Environment Variable:
            </p>
            <CodeString>export INSTILL_API_TOKEN=********</CodeString>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">Example cURL command:</p>
            <CodeBlock
              codeString={curlCommand}
              wrapLongLines={true}
              language="bash"
              customStyle={defaultCodeSnippetStyles}
            />
          </div>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">API Endpoint:</p>
            <CodeString>{`https://api.instill.tech/v1alpha/namespaces/${namespaceId}/catalogs/${kbId}/chunks/similarity`}</CodeString>
          </div>
          <p className="mb-2 product-headings-heading-3">JSON Schema:</p>
          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">Input:</p>
            <CodeBlock
              codeString={inputSchema}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </div>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">Output:</p>
            <CodeBlock
              codeString={outputSchema}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </div>

          {/* <p className="mb-4 product-body-text-3-regular">
            For a more detailed overview of the input/output schemas, check out
            the{" "}
            <a
              href="https://www.instill.tech/docs/artifact/search"
              className="text-semantic-accent-default underline"
            >
              Artifact&apos;s API reference
            </a>
            .
          </p> */}
        </div>
      )}
    </div>
  );
};

export default RetrieveTestTab;
