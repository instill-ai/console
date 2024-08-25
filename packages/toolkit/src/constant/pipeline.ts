import type { PipelineVariableFieldMap } from "instill-sdk";
import { Node } from "reactflow";

import type { NodeData, TriggerNodeData } from "../view";
import { GeneralRecord, Nullable } from "../lib";
import { env } from "../server";
import { triggerPipelineSnippet } from "../view/pipeline-builder/components/triggerPipelineSnippet";

export const generateInputsPayload = (fields: PipelineVariableFieldMap) => {
  const input: GeneralRecord = {};

  for (const [key, value] of Object.entries(fields)) {
    switch (value.instillFormat) {
      case "string": {
        input[key] = "Please put your value here";
        break;
      }
      case "array:string": {
        input[key] = [
          "Please put your first value here",
          "Please put your second value here",
          "...",
        ];
        break;
      }
      case "number": {
        input[key] = 123456;
        break;
      }
      case "array:number": {
        input[key] = [123456, 654321];
        break;
      }
      case "image/*": {
        input[key] = "your image base64 encoded string";
        break;
      }
      case "array:image/*": {
        input[key] = [
          "Please put your first image base64 encoded string",
          "Please put your second image base64 encoded string",
          "...",
        ];
        break;
      }
      case "audio/*": {
        input[key] = "Please put your audio base64 encoded string";
        break;
      }
      case "array:audio/*": {
        input[key] = [
          "Please put your first audio base64 encoded string",
          "Please put your second audio base64 encoded string",
          "...",
        ];
        break;
      }
      case "video/*": {
        input[key] = "Please put your video base64 encoded string";
        break;
      }
      case "array:video/*": {
        input[key] = [
          "Please put your first video base64 encoded string",
          "Please put your second video base64 encoded string",
          "...",
        ];
        break;
      }
      case "boolean": {
        input[key] = true;
        break;
      }
      case "array:boolean": {
        input[key] = [true, false];
        break;
      }
    }
  }

  return input;
};

export const generatePipelineHttpInputStringFromNodes = (
  nodes: Node<NodeData>[],
) => {
  const variableNode = nodes.find((node) => node.id === "variable") as
    | Node<TriggerNodeData>
    | undefined;

  if (!variableNode) {
    return "";
  }

  if (!variableNode.data.fields) {
    return "";
  }

  const input = generateInputsPayload(variableNode.data.fields);

  return JSON.stringify({ inputs: [input] }, null, "\t");
};

export const getInstillPipelineHttpRequestExample = ({
  pipelineName,
  inputsString,
  version,
}: {
  pipelineName?: string;
  inputsString?: string;
  version: Nullable<string>;
}) => {
  if (!pipelineName || !inputsString) {
    return "";
  }

  let snippet = triggerPipelineSnippet;

  const triggerEndpoint =
    version && version !== "latest" ? `releases/${version}/trigger` : "trigger";

  snippet = snippet
    .replace(/\{vdp-pipeline-base-url\}/g, env("NEXT_PUBLIC_API_GATEWAY_URL"))
    .replace(/\{pipeline-name\}/g, pipelineName)
    .replace(/\{input-array\}/g, inputsString)
    .replace(/\{trigger-endpoint\}/g, triggerEndpoint);

  return snippet;
};

export const defaultRawRecipe = `# VDP Version
version: v1beta

# ---------- Data ----------
# Variables that manually trigger the pipeline and can be referenced in component actions
variable:

# Custom user-defined output
output:

# ---------- Schema ----------
# Component actions executed during the pipeline run
# Click "⌘O" to add a new component
component:
`;
