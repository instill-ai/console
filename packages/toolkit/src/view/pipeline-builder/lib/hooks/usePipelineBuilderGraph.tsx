import * as React from "react";

import {
  checkIsValidPosition,
  composeEdgesFromNodes,
  createGraphLayout,
} from "../../..";
import { useUserPipeline } from "../../../../lib/react-query-service";
import {
  InstillStore,
  useInstillStore,
} from "../../../../lib/use-instill-store";
import { useShallow } from "zustand/react/shallow";
import { useAppEntity } from "../../../../lib";
import { createNodesFromPipelineRecipe } from "../createNodesFromPipelineRecipe";

const selector = (store: InstillStore) => ({
  updatePipelineId: store.updatePipelineId,
  updatePipelineName: store.updatePipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateIsOwner: store.updateIsOwner,
  updateCurrentVersion: store.updateCurrentVersion,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updatePipelineIsReadOnly: store.updatePipelineIsReadOnly,
  updateCollapseAllNodes: store.updateCollapseAllNodes,
});

export function usePipelineBuilderGraph() {
  const {
    updatePipelineId,
    updatePipelineName,
    pipelineIsNew,
    updateNodes,
    updateEdges,
    updateIsOwner,
    updateCurrentVersion,
    accessToken,
    enabledQuery,
    updatePipelineIsReadOnly,
    updateCollapseAllNodes,
  } = useInstillStore(useShallow(selector));

  const [graphIsInitialized, setGraphIsInitialized] = React.useState(false);

  const entity = useAppEntity();

  const pipeline = useUserPipeline({
    enabled: enabledQuery && !pipelineIsNew && entity.isSuccess,
    pipelineName: entity.data.pipelineName,
    accessToken,
    retry: false,
  });

  // Initialize the pipeline graph for existed pipeline
  React.useEffect(() => {
    if (
      !pipeline.isSuccess ||
      !entity.isSuccess ||
      graphIsInitialized ||
      pipelineIsNew
    ) {
      return;
    }

    // Check whether current user is the owner of the pipeline
    if (pipeline.data.permission.can_trigger) {
      updateIsOwner(() => true);
    }

    updateCollapseAllNodes(() => false);
    updateCurrentVersion(() => "latest");

    // Set the pipelineID before the graph is initialized
    if (!pipeline.isSuccess) {
      if (entity.data.id) {
        updatePipelineId(() =>
          entity.data.id ? entity.data.id.toString() : null
        );
      }
      return;
    }

    updatePipelineIsReadOnly(() => false);

    // Update pipeline information
    updatePipelineId(() => pipeline.data.id);
    updatePipelineName(() => pipeline.data.name);

    // If the node position data is valid, we can initialize the graph with
    // the node position data. Or we need to initialize the graph with our
    // default graph layout

    if (
      checkIsValidPosition({
        component: pipeline.data.recipe.component ?? null,
        metadata: pipeline.data.metadata,
      })
    ) {
      const nodes = createNodesFromPipelineRecipe(pipeline.data.recipe, {
        metadata: pipeline.data.metadata,
      });

      const edges = composeEdgesFromNodes(nodes);

      updateNodes(() => nodes);
      updateEdges(() => edges);
      setGraphIsInitialized(true);
      return;
    }

    const nodes = createNodesFromPipelineRecipe(pipeline.data.recipe);
    const edges = composeEdgesFromNodes(nodes);

    createGraphLayout(nodes, edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [
    entity.isSuccess,
    entity.data,
    graphIsInitialized,
    pipelineIsNew,
    pipeline.data,
    pipeline.isSuccess,
    updatePipelineId,
    updatePipelineName,
    updateCurrentVersion,
    updateIsOwner,
    updateNodes,
    updateEdges,
    updatePipelineIsReadOnly,
    updateCollapseAllNodes,
  ]);

  return { graphIsInitialized };
}
