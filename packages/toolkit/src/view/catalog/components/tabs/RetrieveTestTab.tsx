"use client";

import * as React from "react";
import { Catalog, Nullable } from "instill-sdk";

import { cn, Separator } from "@instill-ai/design-system";

import { CodeBlock, ModelSectionHeader } from "../../../../components";
import { defaultCodeSnippetStyles, DOCS_BASE_URL } from "../../../../constant";
import { env } from "../../../../server";
import {
  RetrieveTestTabInputSchema,
  RetrieveTestTabOutputSchema,
} from "../lib/constant";

export const RetrieveTestTab = ({
  catalog,
  isProcessed,
  onGoToUpload,
  namespaceId,
  namespaceType,
  isLocalEnvironment,
}: {
  catalog: Catalog;
  isProcessed: boolean;
  onGoToUpload: () => void;
  namespaceId: Nullable<string>;
  namespaceType: Nullable<"user" | "organization">;
  isLocalEnvironment: boolean;
}) => {
  const catalogId = catalog.catalogId;

  const isOrganization = namespaceType === "organization";

  const curlCommand = React.useMemo(() => {
    const baseUrl = env("NEXT_PUBLIC_API_GATEWAY_URL");
    let command = `curl -X POST '${baseUrl}/v1alpha/namespaces/${namespaceId}/catalogs/${catalogId}/chunks/retrieve' \\
--header "Content-Type: application/json" \\
--header "Authorization: Bearer $INSTILL_API_TOKEN"`;

    if (isOrganization && !isLocalEnvironment) {
      command += ` \\
--header "Instill-Requester-Uid: $ORGANIZATION_UID"`;
    }

    command += ` \\
--data '{
  "textPrompt": "Please put your query sentence here",
  "topK": 5
}'`;

    return command;
  }, [namespaceId, catalogId, isOrganization, isLocalEnvironment]);

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
            example to test the retrieval of this catalog and obtain chunks
            related to a given query.
          </p>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">
              Set Environment Variable:
            </p>
            <CodeBlock
              codeString={`$ export INSTILL_API_TOKEN=********
${isOrganization && !isLocalEnvironment ? "$ export ORGANIZATION_UID=********" : ""}`}
              wrapLongLines={true}
              language="bash"
              customStyle={defaultCodeSnippetStyles}
              className={cn({
                "mb-4": isOrganization && !isLocalEnvironment,
              })}
            />
            {isOrganization && !isLocalEnvironment ? (
              <p className="product-body-text-3-regular">
                You can refer{" "}
                <a
                  href="/settings/organizations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-semantic-accent-default underline"
                >
                  here
                </a>{" "}
                to find the corresponding organization UID.
              </p>
            ) : null}
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
              codeString={`${env("NEXT_PUBLIC_API_GATEWAY_URL")}/v1alpha/namespaces/${namespaceId}/catalogs/${catalogId}/chunks/retrieve`}
              wrapLongLines={true}
              customStyle={defaultCodeSnippetStyles}
            />
          </div>
          <ModelSectionHeader>JSON Schema</ModelSectionHeader>
          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">Input:</p>
            <CodeBlock
              codeString={RetrieveTestTabInputSchema}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </div>

          <div className="mb-8">
            <p className="mb-2 text-lg font-semibold">Output:</p>
            <CodeBlock
              codeString={RetrieveTestTabOutputSchema}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </div>

          <p className="mb-4 product-body-text-3-regular">
            For a more detailed overview of the input/output schemas, check out
            the{" "}
            <a
              href={`${DOCS_BASE_URL}/artifact/search`}
              className="text-semantic-accent-default underline"
              target="_blank"
              rel="noopener noreferrer"
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
