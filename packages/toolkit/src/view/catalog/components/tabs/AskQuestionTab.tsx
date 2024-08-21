"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Separator } from "@instill-ai/design-system";

import { CodeBlock, ModelSectionHeader } from "../../../../components";
import { defaultCodeSnippetStyles } from "../../../../constant";
import { Catalog } from "../../../../lib/react-query-service/catalog/types";
import { env } from "../../../../server";

type AskQuestionTabProps = {
  catalog: Catalog;
  isProcessed: boolean;
  onGoToUpload: () => void;
  namespaceId: Nullable<string>;
};

export const AskQuestionTab = ({
  catalog,
  isProcessed,
  onGoToUpload,
  namespaceId,
}: AskQuestionTabProps) => {
  const kbId = catalog.catalogId;

  const curlCommand = React.useMemo(() => {
    const baseUrl = env("NEXT_PUBLIC_API_GATEWAY_URL");
    return `curl -X POST '${baseUrl}/v1alpha/namespaces/${namespaceId}/catalogs/${kbId}/ask' \\
--header "Content-Type: application/json" \\
--header "Authorization: Bearer $INSTILL_API_TOKEN" \\
--data '{
  "question": "Please put your question here",
  "topK": 5
}'`;
  }, [namespaceId, kbId]);

  const inputSchema = `{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "title": "Question"
    },
    "topK": {
      "type": "integer",
      "format": "int64",
      "title": "Top K"
    }
  },
  "required": ["question"],
  "title": "Ask Question Request"
}`;

  const outputSchema = `{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "title": "Answer"
    },
    "referenceSources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chunkUid": {
            "type": "string",
            "title": "Chunk UID"
          },
          "textContent": {
            "type": "string",
            "title": "Text Content"
          },
          "sourceFile": {
            "type": "string",
            "title": "Source File"
          }
        }
      },
      "title": "Reference Sources"
    }
  },
  "title": "Ask Question Response"
}`;

  return (
    <div className="flex flex-col mb-10">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {catalog.name}
        </p>
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
            example to ask questions about the content in your catalog.
          </p>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">
              Set Environment Variable:
            </p>
            <CodeBlock
              codeString={"$ export INSTILL_API_TOKEN=********"}
              wrapLongLines={true}
              language="bash"
              customStyle={defaultCodeSnippetStyles}
            />
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

          <div className="mb-12">
            <p className="mb-2 text-lg font-semibold">API Endpoint:</p>
            <CodeBlock
              codeString={`${env("NEXT_PUBLIC_API_GATEWAY_URL")}/v1alpha/namespaces/${namespaceId}/catalogs/${kbId}/ask`}
              wrapLongLines={true}
              customStyle={defaultCodeSnippetStyles}
            />
          </div>
          <ModelSectionHeader>JSON Schema</ModelSectionHeader>
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

          <p className="mb-4 product-body-text-3-regular">
            For a more detailed overview of the input/output schemas, check out
            the{" "}
            <a
              href="https://www.instill.tech/docs/artifact/ask"
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

export default AskQuestionTab;
