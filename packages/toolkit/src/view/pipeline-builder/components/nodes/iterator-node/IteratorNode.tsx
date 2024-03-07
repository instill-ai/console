import * as React from "react";
import { NodeProps } from "reactflow";
import { IteratorNodeData } from "../../../type";
import { NodeHead, NodeIDEditor, NodeWrapper } from "../common";
import { ImageWithFallback } from "../../../../../components";
import { Button, Icons } from "@instill-ai/design-system";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import {
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
} from "../../../lib";
import { IteratorComponentLabel } from "./IteratorComponentLable";

const selector = (store: InstillStore) => ({
  updateIsEditingIterator: store.updateIsEditingIterator,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  updateEditingIteratorID: store.updateEditingIteratorID,
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
  } = useInstillStore(useShallow(selector));

  return (
    <NodeWrapper nodeData={data} noteIsOpen={noteIsOpen}>
      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <ImageWithFallback
            src="/icons/iterator.svg"
            width={16}
            height={16}
            alt="iterator-icon"
            fallbackImg={
              <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
            }
          />
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
              <div className="flex flex-row">
                <p className="text-semantic-fg-secondary product-body-text-4-medium">
                  Iteration Input
                </p>
              </div>
              <div className="flex">
                <div className="flex min-h-8 w-full rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5">
                  {data.iterator_component.input ? (
                    <p className="rounded bg-semantic-accent-bg px-2 py-0.5 text-semantic-accent-default product-body-text-4-medium">
                      {"$" + `{${data.iterator_component.input}}`}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
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
          </div>
          <Button
            variant="tertiaryColour"
            className="w-full"
            onClick={() => {
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

                createGraphLayout(
                  initialGraphData.nodes,
                  initialGraphData.edges
                )
                  .then((graphData) => {
                    updateNodes(() => graphData.nodes);
                    updateEdges(() => graphData.edges);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            }}
          >
            Edit Iterator
          </Button>
        </React.Fragment>
      )}
    </NodeWrapper>
  );
};
