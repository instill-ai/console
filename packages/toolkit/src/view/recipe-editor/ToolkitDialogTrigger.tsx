"use client";

import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import {
  generatePipelineHttpInputStringFromNodes,
  getInstillPipelineHttpRequestExample,
} from "../../constant/pipeline";
import {
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { PipelineToolkitDialog } from "../pipeline-builder";
import { composeCompleteNodesUnderEditingIteratorMode } from "../pipeline-builder/lib/composeCompleteNodesUnderEditingIteratorMode";

const selector = (store: InstillStore) => ({
  currentVersion: store.currentVersion,
  nodes: store.nodes,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
  editingIteratorID: store.editingIteratorID,
});

export const ToolkitDialogTrigger = () => {
  const routeInfo = useRouteInfo();
  const {
    currentVersion,
    nodes,
    isEditingIterator,
    editingIteratorID,
    tempSavedNodesForEditingIteratorFlow,
  } = useInstillStore(useShallow(selector));
  const [toolKitIsOpen, setToolKitIsOpen] = React.useState(false);

  const codeSnippet = React.useMemo(() => {
    if (!routeInfo.isSuccess || !routeInfo.data.pipelineName) {
      return "";
    }

    let targetNodes = nodes;

    if (isEditingIterator && editingIteratorID) {
      targetNodes = composeCompleteNodesUnderEditingIteratorMode({
        editingIteratorID,
        nodesInIterator: nodes,
        nodesOutsideIterator: tempSavedNodesForEditingIteratorFlow,
      });
    }

    const inputsString = generatePipelineHttpInputStringFromNodes(targetNodes);

    return getInstillPipelineHttpRequestExample({
      pipelineName: routeInfo.data.pipelineName,
      inputsString,
      version: currentVersion,
    });
  }, [
    nodes,
    routeInfo.isSuccess,
    routeInfo.data.pipelineName,
    currentVersion,
    isEditingIterator,
    tempSavedNodesForEditingIteratorFlow,
    editingIteratorID,
  ]);

  return (
    <React.Fragment>
      <Button
        size="md"
        variant="tertiaryGrey"
        className="!p-[9px] my-auto"
        onClick={() => setToolKitIsOpen((prev) => !prev)}
      >
        <Icons.CodeSquare02 className="h-[14px] w-[14px] stroke-semantic-fg-secondary" />
      </Button>
      <PipelineToolkitDialog
        snippet={codeSnippet}
        isOpen={toolKitIsOpen}
        setIsOpen={setToolKitIsOpen}
      />
    </React.Fragment>
  );
};
