import { useShallow } from "zustand/react/shallow";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useUserPipeline,
} from "../../../lib";
import {
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
  useSortedReleases,
} from "../lib";
import { Edge, Node } from "reactflow";
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
    pipelineName,
    accessToken,
    enabledQuery: pipelineIsNew ? false : enabledQuery,
  });

  const pipeline = useUserPipeline({
    enabled: enabledQuery && !pipelineIsNew,
    pipelineName,
    accessToken,
    retry: false,
  });

  return currentVersion === "latest" || sortedReleases.length === 0 ? null : (
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
            if (sortedReleases.length === 0 || !pipeline.isSuccess) {
              return;
            }

            updateCurrentVersion(() => "latest");

            let newNodes: Node<NodeData>[] = [];
            let newEdges: Edge[] = [];

            if (
              checkIsValidPosition(
                pipeline.data.recipe,
                pipeline.data.metadata ?? null
              )
            ) {
              const { nodes, edges } = createInitialGraphData(
                pipeline.data.recipe,
                {
                  metadata: pipeline.data.metadata,
                }
              );
              newNodes = nodes;
              newEdges = edges;
            } else {
              const { nodes, edges } = createInitialGraphData(
                pipeline.data.recipe
              );
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
