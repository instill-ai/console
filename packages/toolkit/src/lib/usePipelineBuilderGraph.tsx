import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  NodeData,
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
} from "../view";
import { useUserPipeline } from "./react-query-service";
import { useRouter } from "next/router";
import { InstillStore, useInstillStore } from "./use-instill-store";
import { useShallow } from "zustand/react/shallow";
import { Node } from "reactflow";
import { useEntity } from "./useEntity";

const selector = (store: InstillStore) => ({
  updatePipelineId: store.updatePipelineId,
  updatePipelineName: store.updatePipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateIsOwner: store.updateIsOwner,
  updateCurrentVersion: store.updateCurrentVersion,
  initializedByTemplateOrClone: store.initializedByTemplateOrClone,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updatePipelineIsReadOnly: store.updatePipelineIsReadOnly,
});

export function usePipelineBuilderGraph() {
  const router = useRouter();
  const { id } = router.query;

  const {
    updatePipelineId,
    updatePipelineName,
    pipelineIsNew,
    updateNodes,
    updateEdges,
    updateIsOwner,
    updateCurrentVersion,
    initializedByTemplateOrClone,
    accessToken,
    enabledQuery,
    updatePipelineIsReadOnly,
  } = useInstillStore(useShallow(selector));

  const [graphIsInitialized, setGraphIsInitialized] = React.useState(false);

  const entity = useEntity();

  const pipeline = useUserPipeline({
    enabled: enabledQuery && !pipelineIsNew && entity.isSuccess,
    pipelineName: entity.pipelineName,
    accessToken,
    retry: false,
  });

  // Initialize the pipeline graph of new pipeline
  React.useEffect(() => {
    if (!pipelineIsNew || graphIsInitialized) {
      return;
    }

    updateCurrentVersion(() => "latest");
    updateIsOwner(() => true);

    // We already initialized the pipeline when user select the template
    if (initializedByTemplateOrClone) {
      setGraphIsInitialized(true);
      return;
    }

    const initialEmptyNodeId = uuidv4();

    const newNodes: Node<NodeData>[] = [
      {
        id: "start",
        type: "startNode",
        data: {
          nodeType: "start",
          component: {
            id: "start",
            type: "COMPONENT_TYPE_OPERATOR",
            configuration: { metadata: {} },
            resource_name: null,
            resource: null,
            definition_name: "operator-definitions/start",
            operator_definition: null,
          },
          note: null,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: initialEmptyNodeId,
        type: "emptyNode",
        data: {
          nodeType: "empty",
          component: null,
          note: null,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "end",
        type: "endNode",
        data: {
          nodeType: "end",
          component: {
            id: "end",
            type: "COMPONENT_TYPE_OPERATOR",
            configuration: {
              metadata: {},
              input: {},
            },
            resource_name: null,
            resource: null,
            definition_name: "operator-definitions/end",
            operator_definition: null,
          },
          note: null,
        },
        position: { x: 0, y: 0 },
      },
    ];
    const newEdges = [
      {
        id: "start-empty",
        type: "customEdge",
        source: "start",
        target: initialEmptyNodeId,
      },
      {
        id: "empty-end",
        type: "customEdge",
        source: initialEmptyNodeId,
        target: "end",
      },
    ];

    // Because the pipeline is new, we need to initialize it with our default
    // graph layout
    createGraphLayout(newNodes, newEdges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [
    graphIsInitialized,
    initializedByTemplateOrClone,
    pipelineIsNew,
    updateIsOwner,
    updateNodes,
    updateEdges,
    updateCurrentVersion,
  ]);

  // Initialize the pipeline graph for existed pipeline
  React.useEffect(() => {
    if (!pipeline.isSuccess || graphIsInitialized || pipelineIsNew) {
      return;
    }

    // Check whether current user is the owner of the pipeline
    if (pipeline.data.permission.can_trigger) {
      updateIsOwner(() => true);
    }

    updateCurrentVersion(() => "latest");

    // Set the pipelineID before the graph is initialized
    if (!pipeline.isSuccess) {
      if (id) {
        updatePipelineId(() => id.toString());
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
    if (checkIsValidPosition(pipeline.data.recipe, pipeline.data.metadata)) {
      const initialGraphData = createInitialGraphData(pipeline.data.recipe, {
        metadata: pipeline.data.metadata,
      });

      updateNodes(() => initialGraphData.nodes);
      updateEdges(() => initialGraphData.edges);
      setGraphIsInitialized(true);
      return;
    }

    const initialGraphData = createInitialGraphData(pipeline.data.recipe);

    createGraphLayout(initialGraphData.nodes, initialGraphData.edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [
    id,
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
  ]);

  return { graphIsInitialized };
}
