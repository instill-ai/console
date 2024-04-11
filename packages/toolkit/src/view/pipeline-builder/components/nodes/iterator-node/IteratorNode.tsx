"use client";

import * as React from "react";
import { NodeProps } from "reactflow";
import { IteratorNodeData } from "../../../type";
import { NodeHead, NodeIDEditor, NodeWrapper } from "../common";
import { Button, Icons } from "@instill-ai/design-system";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import {
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
} from "../../../lib";
import { IteratorComponentLabel } from "./IteratorComponentLable";
import { ComponentOutputReferenceHints } from "../../ComponentOutputReferenceHints";

const selector = (store: InstillStore) => ({
  updateIsEditingIterator: store.updateIsEditingIterator,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  updateEditingIteratorID: store.updateEditingIteratorID,
  collapseAllNodes: store.collapseAllNodes,
});

export const IteratorNode = ({ data, id }: NodeProps<IteratorNodeData>) => {
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);

  const {
    updateIsEditingIterator,
    nodes,
    updateNodes,
    updateEdges,
    updateTempSavedNodesForEditingIteratorFlow,
    updateEditingIteratorID,
    collapseAllNodes,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  const editIterator = React.useCallback(
    function () {
      updateIsEditingIterator(() => true);
      updateEditingIteratorID(() => data.id);
      updateTempSavedNodesForEditingIteratorFlow(() => nodes);

      if (
        checkIsValidPosition(
          data.iterator_component.components,
          data.metadata ?? null
        )
      ) {
        const initialGraphData = createInitialGraphData(
          data.iterator_component.components,
          {
            metadata: data.metadata,
          }
        );

        updateNodes(() => initialGraphData.nodes);
        updateEdges(() => initialGraphData.edges);

        return;
      } else {
        const initialGraphData = createInitialGraphData(
          data.iterator_component.components
        );

        updateNodes(() => initialGraphData.nodes);
        updateEdges(() => initialGraphData.edges);

        createGraphLayout(initialGraphData.nodes, initialGraphData.edges)
          .then((graphData) => {
            updateNodes(() => graphData.nodes);
            updateEdges(() => graphData.edges);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    [
      data,
      nodes,
      updateEdges,
      updateEditingIteratorID,
      updateIsEditingIterator,
      updateNodes,
      updateTempSavedNodesForEditingIteratorFlow,
    ]
  );

  return (
    <NodeWrapper nodeData={data} noteIsOpen={noteIsOpen}>
      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <div className="my-auto flex h-6 w-6 rounded bg-semantic-accent-bg">
            <Icons.Repeat04 className="m-auto h-4 w-4 stroke-semantic-accent-default" />
          </div>
          <NodeIDEditor currentNodeID={id} />
        </div>
        <ConnectorOperatorControlPanel
          nodeID={id}
          nodeData={data}
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen((prev) => !prev)}
          noteIsOpen={noteIsOpen}
        />
      </NodeHead>
      {nodeIsCollapsed ? null : (
        <React.Fragment>
          <div className="mb-2 flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2">
              {data.iterator_component.input ? null : (
                <p className="rounded bg-semantic-accent-bg px-1 py-2 text-semantic-fg-disabled product-body-text-4-medium">
                  Loop through an array and filter based on multiple criteria
                </p>
              )}

              {data.iterator_component.input ? (
                <React.Fragment>
                  <div className="flex flex-row">
                    <p className="text-semantic-fg-secondary product-body-text-4-medium">
                      Iteration Input
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex min-h-8 w-full rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5">
                      <p className="rounded bg-semantic-accent-bg px-2 py-0.5 text-semantic-accent-default product-body-text-4-medium">
                        {data.iterator_component.input}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
            {data.iterator_component.components.length > 0 ? (
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row">
                  <p className="text-semantic-fg-secondary product-body-text-4-medium">
                    Iteration components
                  </p>
                </div>
                <div className="flex flex-col gap-y-2">
                  {data.iterator_component.components.map((component) => (
                    <IteratorComponentLabel
                      key={component.id}
                      component={component}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Button
            variant="tertiaryColour"
            className="w-full"
            onClick={editIterator}
          >
            Edit Iterator
          </Button>
          <div className="mb-4 w-full">
            <ComponentOutputReferenceHints component={data} />
          </div>
        </React.Fragment>
      )}
    </NodeWrapper>
  );
};
