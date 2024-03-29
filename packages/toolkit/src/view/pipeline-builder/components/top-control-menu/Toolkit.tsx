"use client";

import * as React from "react";
import { PipelineToolkitDialog } from "../PipelineToolkitDialog";
import { Button, Icons } from "@instill-ai/design-system";
import {
  GeneralRecord,
  InstillStore,
  useEntity,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { StartNodeData } from "../../type";
import { Node } from "reactflow";
import { triggerPipelineSnippets } from "../triggerPipelineSnippets";
import { composeCompleteNodesUnderEditingIteratorMode } from "../../lib/composeCompleteNodesUnderEditingIteratorMode";
import { env } from "../../../../server";

const selector = (store: InstillStore) => ({
  currentVersion: store.currentVersion,
  nodes: store.nodes,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
  editingIteratorID: store.editingIteratorID,
});

export const Toolkit = () => {
  const entity = useEntity();
  const {
    currentVersion,
    nodes,
    isEditingIterator,
    editingIteratorID,
    tempSavedNodesForEditingIteratorFlow,
  } = useInstillStore(useShallow(selector));
  const [toolKitIsOpen, setToolKitIsOpen] = React.useState(false);

  const codeSnippte = React.useMemo(() => {
    if (!entity.isSuccess) {
      return "";
    }

    let targetNodes = nodes;

    if (isEditingIterator && editingIteratorID) {
      targetNodes = composeCompleteNodesUnderEditingIteratorMode({
        editingIteratorID,
        iteratorComponents: nodes.map((node) => node.data),
        allNodes: tempSavedNodesForEditingIteratorFlow,
      });
    }

    const input: GeneralRecord = {};

    const startNode = targetNodes.find((e) => e.data.id === "start") as
      | Node<StartNodeData>
      | undefined;

    if (!startNode) {
      return "";
    }

    if (!startNode.data.start_component.fields) {
      return "";
    }

    for (const [key, value] of Object.entries(
      startNode.data.start_component.fields
    )) {
      switch (value.instill_format) {
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

    const inputsString = JSON.stringify({ inputs: [input] }, null, "\t");

    let snippet =
      env("NEXT_PUBLIC_APP_ENV") === "CLOUD"
        ? triggerPipelineSnippets.cloud
        : triggerPipelineSnippets.core;

    const triggerEndpoint =
      currentVersion === "latest"
        ? "trigger"
        : `releases/${currentVersion}/trigger`;

    snippet = snippet
      .replace(/\{vdp-pipeline-base-url\}/g, env("NEXT_PUBLIC_API_GATEWAY_URL"))
      .replace(/\{pipeline-name\}/g, entity.pipelineName)
      .replace(/\{input-array\}/g, inputsString)
      .replace(/\{trigger-endpoint\}/g, triggerEndpoint);

    return snippet;
  }, [
    nodes,
    entity.isSuccess,
    entity.pipelineName,
    currentVersion,
    isEditingIterator,
    tempSavedNodesForEditingIteratorFlow,
    editingIteratorID,
  ]);

  return (
    <React.Fragment>
      <Button
        size="md"
        variant="tertiaryColour"
        className="flex !h-8 flex-row gap-x-2"
        onClick={() => setToolKitIsOpen((prev) => !prev)}
      >
        Toolkit
        <Icons.CodeSquare02 className="h-4 w-4 stroke-semantic-fg-secondary" />
      </Button>
      <PipelineToolkitDialog
        snippet={codeSnippte}
        isOpen={toolKitIsOpen}
        setIsOpen={setToolKitIsOpen}
      />
    </React.Fragment>
  );
};
