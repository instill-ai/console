import cn from "clsx";
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Nullable, useUserPipeline, useUser } from "@instill-ai/toolkit";
import { shallow } from "zustand/shallow";
import { Edge, Node, ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";

type GetLayOutProps = {
  page: ReactElement;
};

import { PageBase, PageHead, Topbar } from "@/components";
import { useRouter } from "next/router";
import { RightPanel } from "pipeline-builder/RightPanel";
import { Flow } from "pipeline-builder/Flow";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "pipeline-builder/usePipelineBuilderStore";
import {
  createGraphLayout,
  createInitialGraphData,
} from "pipeline-builder/lib";
import { NodeData } from "pipeline-builder/type";
import { PipelineNameForm } from "pipeline-builder/components/PipelineNameForm";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  setPipelineId: state.setPipelineId,
  setPipelineUid: state.setPipelineUid,
  setPipelineDescription: state.setPipelineDescription,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  connectorFormIsDirty: state.connectorFormIsDirty,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
  pipelineIsNew: state.pipelineIsNew,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updatePipelineOpenAPISchema: state.updatePipelineOpenAPISchema,
});

export const DROPPABLE_AREA_ID = "pipeline-builder-droppable";

const PipelineBuilderPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const {
    setPipelineId,
    setPipelineUid,
    setPipelineDescription,
    updateNodes,
    updateEdges,
    pipelineIsNew,
    selectedConnectorNodeId,
    updatePipelineOpenAPISchema,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const router = useRouter();
  const { id } = router.query;

  // We need to warn user of unsave changes when they try to leave the page

  // We initialize the pipeline with default start, end operator and a empty node.

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  useEffect(() => {
    if (!pipelineIsNew) return;

    const initialEmptyNodeId = uuidv4();

    const nodes: Node<NodeData>[] = [
      {
        id: "start",
        type: "startNode",
        data: {
          nodeType: "start",
          component: {
            id: "start",
            type: "COMPONENT_TYPE_OPERATOR",
            configuration: { metadata: {} },
            resource_name: "",
            resource: null,
            definition_name: "operator-definitions/start-operator",
            operator_definition: null,
          },
        },
        position: { x: 0, y: 0 },
      },
      {
        id: initialEmptyNodeId,
        type: "emptyNode",
        data: {
          nodeType: "empty",
          component: null,
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
            resource_name: "",
            resource: null,
            definition_name: "operator-definitions/end-operator",
            operator_definition: null,
          },
        },
        position: { x: 0, y: 0 },
      },
    ];

    const edges: Edge[] = [
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

    createGraphLayout(nodes, edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pipelineIsNew, updateEdges, updateNodes]);

  const pipeline = useUserPipeline({
    enabled: !!id && !pipelineIsNew,
    pipelineName: user.isSuccess
      ? id
        ? `${user.data.name}/pipelines/${id}`
        : null
      : null,
    accessToken: null,
    retry: false,
  });

  const [reactFlowInstance, setReactFlowInstance] =
    useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------------------------
   * Initialize pipeline id
   * -----------------------------------------------------------------------*/

  useEffect(() => {
    if (!pipeline.isSuccess) {
      if (id) {
        setPipelineId(id.toString());
      }
      return;
    }

    setPipelineUid(pipeline.data.uid);
    setPipelineId(pipeline.data.id);
    setPipelineDescription(pipeline.data.description);
  }, [
    pipeline.data,
    pipeline.isSuccess,
    setPipelineDescription,
    setPipelineId,
    setPipelineUid,
    id,
  ]);

  /* -------------------------------------------------------------------------
   * Initialize graph
   * -----------------------------------------------------------------------*/

  const [graphIsInitialized, setGraphIsInitialized] = useState(false);

  useEffect(() => {
    if (!pipeline.isSuccess || graphIsInitialized) {
      return;
    }

    const initialData = createInitialGraphData({
      pipeline: {
        ...pipeline.data,
        recipe: {
          ...pipeline.data.recipe,
        },
      },
    });

    createGraphLayout(initialData.nodes, initialData.edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    pipeline.isSuccess,
    setPipelineId,
    setPipelineUid,
    graphIsInitialized,
    pipeline.data,
    updateEdges,
    updateNodes,
  ]);

  useEffect(() => {
    if (!pipeline.isSuccess) return;
    updatePipelineOpenAPISchema(() => pipeline.data.openapi_schema);
  }, [pipeline.isSuccess, pipeline.data]);

  const isLoadingGraphFirstPaint = useMemo(() => {
    if (pipelineIsNew) return false;

    return false;
  }, [pipelineIsNew]);

  return (
    <>
      <PageBase>
        <Topbar>
          <div className="flex px-3 py-2">
            <PipelineNameForm accessToken={null} />
          </div>
        </Topbar>
        <PageBase.Container>
          <style jsx>
            {`
              .pipeline-builder {
                --sidebar-width: 96px;
                --left-panel-width: 256px;
                --right-panel-width: 456px;
              }
            `}
          </style>
          <PageHead title="pipeline-builder" />
          <div className="pipeline-builder flex h-[calc(100vh-var(--topbar-height))] w-full flex-row overflow-x-hidden bg-semantic-bg-base-bg">
            <Flow
              ref={reactFlowWrapper}
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
              accessToken={null}
              enableQuery={true}
              isLoading={isLoadingGraphFirstPaint}
            />
            <div
              className={cn(
                "flex w-[var(--right-panel-width)] transform flex-col overflow-y-scroll bg-semantic-bg-primary p-6 duration-500",
                selectedConnectorNodeId
                  ? "mr-0"
                  : "-mr-[var(--right-panel-width)]"
              )}
            >
              <RightPanel accessToken={null} />
            </div>
          </div>
        </PageBase.Container>
      </PageBase>
    </>
  );
};

export default PipelineBuilderPage;
