"use client";

import { InstillNameInterpreter } from "instill-sdk";
import { Edge, Node } from "reactflow";
import { useShallow } from "zustand/react/shallow";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useSortedReleases,
} from "../../../lib";
import {
  checkIsValidPosition,
  composeEdgesFromNodes,
  createGraphLayout,
} from "../lib";
import { createNodesFromPipelineRecipe } from "../lib/createNodesFromPipelineRecipe";
import { NodeData } from "../type";

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateCurrentVersion: store.updateCurrentVersion,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  currentVersion: store.currentVersion,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const BackToLatestVersionTopBar = () => {
  const {
    pipelineName,
    pipelineIsNew,
    updateCurrentVersion,
    updateNodes,
    updateEdges,
    currentVersion,
    accessToken,
    enabledQuery,
  } = useInstillStore(useShallow(selector));

  const sortedReleases = useSortedReleases({
    namespaceId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).namespaceId
      : null,
    pipelineId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).resourceId
      : null,
    accessToken,
    enabledQuery: pipelineIsNew ? false : enabledQuery,
    view: "VIEW_FULL",
    shareCode: null,
  });

  const pipeline = useNamespacePipeline({
    enabled: enabledQuery && !!pipelineName && !pipelineIsNew,
    namespaceId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).namespaceId
      : null,
    pipelineId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).resourceId
      : null,
    accessToken,
    view: "VIEW_FULL",
    shareCode: null,
  });

  return currentVersion === "latest" ||
    sortedReleases.data.length === 0 ? null : (
    <div className="flex h-8 w-full flex-col bg-semantic-bg-base-bg">
      <p className="m-auto">
        <span className="text-semantic-fg-secondary product-body-text-4-medium ">
          You are viewing a past version of this pipeline, which is not
          editable.
        </span>
        {` `}
        <span
          className="cursor-pointer text-semantic-accent-default product-body-text-4-medium hover:!underline"
          onClick={() => {
            if (
              sortedReleases.data.length === 0 ||
              !pipeline.isSuccess ||
              !pipeline.data.recipe
            ) {
              return;
            }

            updateCurrentVersion(() => "latest");

            let newNodes: Node<NodeData>[] = [];
            let newEdges: Edge[] = [];

            if (
              checkIsValidPosition({
                component: pipeline.data.recipe.component ?? null,
                metadata: pipeline.data.metadata ?? null,
              })
            ) {
              const nodes = createNodesFromPipelineRecipe(
                pipeline.data.recipe,
                {
                  metadata: pipeline.data.metadata,
                },
              );
              const edges = composeEdgesFromNodes(nodes);

              newNodes = nodes;
              newEdges = edges;
            } else {
              const nodes = createNodesFromPipelineRecipe(pipeline.data.recipe);
              const edges = composeEdgesFromNodes(nodes);
              newNodes = nodes;
              newEdges = edges;
            }

            createGraphLayout(newNodes, newEdges)
              .then((graphData) => {
                updateNodes(() => graphData.nodes);
                updateEdges(() => graphData.edges);
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          Click Here
        </span>
        {` `}
        <span className="text-semantic-fg-secondary product-body-text-4-medium">
          for the latest version.
        </span>
      </p>
    </div>
  );
};
