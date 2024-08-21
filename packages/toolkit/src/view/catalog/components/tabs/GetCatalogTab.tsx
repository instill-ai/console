"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Separator } from "@instill-ai/design-system";

import { CodeBlock, ModelSectionHeader } from "../../../../components";
import { defaultCodeSnippetStyles } from "../../../../constant";
import { Catalog } from "../../../../lib/react-query-service/catalog/types";
import { env } from "../../../../server";

type GetCatalogTabProps = {
  catalog: Catalog;
  isProcessed: boolean;
  onGoToUpload: () => void;
  namespaceId: Nullable<string>;
};

export const GetCatalogTab = ({
  catalog,
  isProcessed,
  onGoToUpload,
  namespaceId,
}: GetCatalogTabProps) => {
  const kbId = catalog.catalogId;

  const curlCommand1 = React.useMemo(() => {
    const baseUrl = env("NEXT_PUBLIC_API_GATEWAY_URL");
    return `curl -X GET '${baseUrl}/v1alpha/namespaces/${namespaceId}/catalogs/${kbId}?fileUid=${'{fileUid}'}' \\
--header "Content-Type: application/json" \\
--header "Authorization: Bearer $INSTILL_API_TOKEN"`;
  }, [namespaceId, kbId]);

  const apiEndpoint1 = React.useMemo(() => {
    const baseUrl = env("NEXT_PUBLIC_API_GATEWAY_URL");
    return `${baseUrl}/v1alpha/namespaces/${namespaceId}/catalogs/${kbId}?fileUid=${'{fileUid}'}`;
  }, [namespaceId, kbId]);

  const inputSchema = `{
  "type": "object",
  "properties": {
    "namespaceId": {
      "type": "string",
      "title": "Namespace ID"
    },
    "catalogId": {
      "type": "string",
      "title": "Catalog ID"
    },
    "fileUid": {
      "type": "string",
      "title": "File UID"
    },
    "fileId": {
      "type": "string",
      "title": "File ID"
    }
  },
  "title": "Get File Catalog Request"
}`;

  const outputSchema = `{
  "type": "object",
  "properties": {
    "originalData": {
      "type": "string",
      "title": "Original data encoded in base64"
    },
    "metadata": {
      "type": "object",
      "title": "File Catalog Metadata",
      "properties": {
        "fileUid": {
          "type": "string",
          "title": "File UID"
        },
        "fileId": {
          "type": "string",
          "title": "File ID"
        },
        "fileType": {
          "type": "string",
          "title": "File Type"
        },
        "fileSize": {
          "type": "integer",
          "format": "int64",
          "title": "File Size in Bytes"
        },
        "fileUploadTime": {
          "type": "string",
          "format": "date-time",
          "title": "Upload Time"
        },
        "fileProcessStatus": {
          "type": "string",
          "title": "File Process Status"
        }
      }
    },
    "text": {
      "type": "object",
      "title": "Transformed Text Content",
      "properties": {
        "pipelineIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Pipelines"
        },
        "transformedContent": {
          "type": "string",
          "title": "Transformed Content"
        },
        "transformedContentUid": {
          "type": "string",
          "title": "Transformed Content UID"
        },
        "transformedContentChunkNum": {
          "type": "integer",
          "format": "int32",
          "title": "Transformed Content Chunk Number"
        },
        "transformedContentTokenNum": {
          "type": "integer",
          "format": "int32",
          "title": "Transformed Content Token Number"
        },
        "transformedContentUpdateTime": {
          "type": "string",
          "format": "date-time",
          "title": "Transformed Content Update Time"
        }
      }
    },
    "chunks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "uid": {
            "type": "string",
            "title": "Chunk UID"
          },
          "type": {
            "type": "string",
            "title": "Chunk Type"
          },
          "startPos": {
            "type": "integer",
            "format": "int32",
            "title": "Chunk Start Position"
          },
          "endPos": {
            "type": "integer",
            "format": "int32",
            "title": "Chunk End Position"
          },
          "content": {
            "type": "string",
            "title": "Chunk Content"
          },
          "tokensNum": {
            "type": "integer",
            "format": "int32",
            "title": "Chunk Tokens Number"
          },
          "embedding": {
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            },
            "title": "Embedding"
          },
          "createTime": {
            "type": "string",
            "format": "date-time",
            "title": "Chunk Create Time"
          },
          "retrievable": {
            "type": "boolean",
            "title": "Chunk Retrievable"
          }
        }
      },
      "title": "Chunks"
    }
  },
  "title": "Get File Catalog Response"
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
            Once the status of documents in a catalog&apos;s files has changed to
            &apos;Completed&apos;, you can use the following Instill API example
            to retrieve the file catalog&apos;s detailed information and obtain
            the necessary chunks and metadata.
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
              codeString={curlCommand1}
              wrapLongLines={true}
              language="bash"
              customStyle={defaultCodeSnippetStyles}
            />
          </div>

          <div className="mb-12">
            <p className="mb-2 text-lg font-semibold">API Endpoint:</p>
            <CodeBlock
              codeString={apiEndpoint1}
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
              href="https://www.instill.tech/docs/artifact/get"
              className="text-semantic-accent-default underline"
            >
              Artifact&apos;s API reference
            </a>
            .
          </p>
        </div>
      )
      }
    </div >
  );
};

export default GetCatalogTab;