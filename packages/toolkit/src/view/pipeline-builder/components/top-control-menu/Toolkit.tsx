"use client";

import * as React from "react";
import { Button, Icons } from "@instill-ai/design-system";
import {
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { composeCompleteNodesUnderEditingIteratorMode } from "../../lib/composeCompleteNodesUnderEditingIteratorMode";
import { PipelineToolkitDialog } from "../PipelineToolkitDialog";
import { generatePipelineHttpInputStringFromNodes, getInstillPipelineHttpRequestExample } from "../../../../constant/pipeline";

const selector = (store: InstillStore) => ({
  currentVersion: store.currentVersion,
  nodes: store.nodes,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
  editingIteratorID: store.editingIteratorID,
});

export const Toolkit = () => {
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
        className="flex !h-8 flex-row gap-x-2"
        onClick={() => setToolKitIsOpen((prev) => !prev)}
      >
        Toolkit
        <Icons.CodeSquare02 className="h-4 w-4 stroke-semantic-fg-secondary" />
      </Button>
      <PipelineToolkitDialog
        snippet={codeSnippet}
        isOpen={toolKitIsOpen}
        setIsOpen={setToolKitIsOpen}
      />
    </React.Fragment>
  );
};
