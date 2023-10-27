import cn from "clsx";
import * as React from "react";
import { shallow } from "zustand/shallow";
import { v4 as uuidv4 } from "uuid";

import {
  CreateUserPipelinePayload,
  GeneralPageProp,
  Nullable,
  UpdateUserPipelinePayload,
  getInstillApiErrorMessage,
  useCreateUserPipeline,
  useNavigationObserver,
  useUpdateUserPipeline,
  useUser,
  useUserPipeline,
} from "../../lib";
import {
  BottomBar,
  Flow,
  NodeData,
  PipelineBuilderStore,
  RightPanel,
  constructPipelineRecipe,
  createGraphLayout,
  createInitialGraphData,
  usePipelineBuilderStore,
} from "../pipeline-builder";
import { useToast } from "@instill-ai/design-system";
import { Edge, Node, ReactFlowInstance } from "reactflow";
import { WarnUnsavedChangesModal } from "../../components";
import { isAxiosError } from "axios";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  pipelineId: state.pipelineId,
  setPipelineId: state.setPipelineId,
  setPipelineUid: state.setPipelineUid,
  setPipelineName: state.setPipelineName,
  setPipelineDescription: state.setPipelineDescription,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  pipelineRecipeIsDirty: state.pipelineRecipeIsDirty,
  pipelineIsNew: state.pipelineIsNew,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updatePipelineOpenAPISchema: state.updatePipelineOpenAPISchema,
  updateAccessToken: state.updateAccessToken,
  initializedByTemplateOrClone: state.initializedByTemplateOrClone,
  updateIsOwner: state.updateIsOwner,
  updateCurrentVersion: state.updateCurrentVersion,
});

export type PipelineBuilderMainViewProps = GeneralPageProp;

export const PipelineBuilderMainView = (
  props: PipelineBuilderMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id, entity } = router.query;
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);

  const {
    nodes,
    edges,
    pipelineId,
    setPipelineId,
    setPipelineUid,
    setPipelineName,
    setPipelineDescription,
    updateNodes,
    updateEdges,
    pipelineRecipeIsDirty,
    pipelineIsNew,
    selectedConnectorNodeId,
    updatePipelineOpenAPISchema,
    updateAccessToken,
    initializedByTemplateOrClone,
    updateIsOwner,
    updateCurrentVersion,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const [warnUnsaveChangesModalIsOpen, setWarnUnsaveChangesModalIsOpen] =
    React.useState(false);

  const { toast } = useToast();

  const createPipeline = useCreateUserPipeline();
  const updatePipeline = useUpdateUserPipeline();

  const { confirmNavigation } = useNavigationObserver({
    shouldStopNavigation: pipelineRecipeIsDirty ? true : false,
    onNavigate: () => {
      setWarnUnsaveChangesModalIsOpen(true);
    },
    router,
  });
  const user = useUser({
    enabled: enableQuery,
    accessToken,
    retry: false,
  });

  const pipeline = useUserPipeline({
    enabled: enableQuery && !!id && !pipelineIsNew,
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    retry: false,
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess) return;
    updatePipelineOpenAPISchema(() => pipeline.data.openapi_schema);
  }, [pipeline.isSuccess, pipeline.data, updatePipelineOpenAPISchema]);

  React.useEffect(() => {
    updateAccessToken(() => accessToken);
  }, [accessToken, updateAccessToken]);

  /* -------------------------------------------------------------------------
   * If the pipeline is not new and we can't find it, redirect to /pipelines
   * -----------------------------------------------------------------------*/

  React.useEffect(() => {
    if (!pipelineIsNew && pipeline.isError) {
      router.push(`/${entity}/pipelines`);
    }
  }, [pipeline.isError, pipelineIsNew, router, entity]);

  /* -------------------------------------------------------------------------
   * Set initial pipeline node data if pipeline is new
   * initialize graph if pipeline is not new
   * -----------------------------------------------------------------------*/

  const [graphIsInitialized, setGraphIsInitialized] = React.useState(false);

  React.useEffect(() => {
    console.log(graphIsInitialized);
    if (graphIsInitialized || !user.isSuccess) return;

    updateCurrentVersion(() => "latest");

    // If the pipeline is new, we need to give it initial data
    if (pipelineIsNew) {
      let newNodes: Node<NodeData>[] = [];
      let newEdges: Edge[] = [];

      updateIsOwner(() => true);

      if (initializedByTemplateOrClone) {
        newNodes = nodes;
        newEdges = edges;
      } else {
        const initialEmptyNodeId = uuidv4();

        newNodes = [
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
                definition_name: "operator-definitions/op-start",
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
                resource_name: null,
                resource: null,
                definition_name: "operator-definitions/op-end",
                operator_definition: null,
              },
            },
            position: { x: 0, y: 0 },
          },
        ];
        newEdges = [
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
      }

      createGraphLayout(newNodes, newEdges)
        .then((graphData) => {
          updateNodes(() => graphData.nodes);
          updateEdges(() => graphData.edges);
          setGraphIsInitialized(true);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }

    // If the pipeline is not new, but we get the slug, we need to set the
    // pipeline id

    if (!pipeline.isSuccess) {
      if (id) {
        setPipelineId(id.toString());
      }
      return;
    }

    // Check whether current user is the owner of the pipeline
    if (pipeline.data.user !== user.data.name) {
      updateIsOwner(() => false);
    } else {
      updateIsOwner(() => true);
    }

    // If the pipeline is not new and we have the pipeline data, we need to
    // set the pipeline id and update the graph

    setPipelineUid(pipeline.data.uid);
    setPipelineId(pipeline.data.id);
    setPipelineName(pipeline.data.name);
    setPipelineDescription(pipeline.data.description);

    const initialGraphData = createInitialGraphData(pipeline.data.recipe);

    createGraphLayout(initialGraphData.nodes, initialGraphData.edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }, [
    pipelineIsNew,
    pipeline.isSuccess,
    updateEdges,
    updateNodes,
    pipeline.data,
    setPipelineDescription,
    setPipelineId,
    setPipelineUid,
    id,
    setPipelineName,
    graphIsInitialized,
    nodes,
    edges,
    initializedByTemplateOrClone,
    updateIsOwner,
    user.data?.name,
    user.isSuccess,
    updateCurrentVersion,
  ]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex w-full flex-col">
      <style jsx>
        {`
          .pipeline-builder {
            --sidebar-width: 96px;
            --left-panel-width: 256px;
            --right-panel-width: 456px;
          }
        `}
      </style>

      {/* 
        Pipeline builder main canvas
      */}

      <div className="pipeline-builder flex h-[calc(100vh-var(--topbar-height)-var(--pipeline-builder-bottom-bar-height))] w-full flex-row overflow-x-hidden bg-semantic-bg-base-bg">
        <Flow
          ref={reactFlowWrapper}
          reactFlowInstance={reactFlowInstance}
          setReactFlowInstance={setReactFlowInstance}
          accessToken={accessToken}
          enableQuery={enableQuery}
          isLoading={graphIsInitialized ? false : true}
          appEnv="APP_ENV_CLOUD"
        />
        <div
          className={cn(
            "flex w-[var(--right-panel-width)] transform flex-col overflow-y-scroll bg-semantic-bg-primary p-6 duration-500",
            selectedConnectorNodeId ? "mr-0" : "-mr-[var(--right-panel-width)]"
          )}
        >
          <RightPanel />
        </div>
      </div>

      {/* 
        Pipeline builder bottom bar
      */}

      <div className="h-[var(--pipeline-builder-bottom-bar-height)]">
        <BottomBar enableQuery={enableQuery} accessToken={accessToken} />
      </div>

      {/* 
        Warn unsaved changes modal
      */}

      <WarnUnsavedChangesModal
        open={warnUnsaveChangesModalIsOpen}
        setOpen={setWarnUnsaveChangesModalIsOpen}
        onCancel={() => setWarnUnsaveChangesModalIsOpen(false)}
        onDiscard={() => {
          confirmNavigation();
        }}
        onSave={async () => {
          if (!pipelineId) {
            return;
          }

          if (!pipelineIsNew) {
            const payload: UpdateUserPipelinePayload = {
              name: `users/${entity}/pipelines/${pipelineId}`,
              recipe: constructPipelineRecipe(nodes),
            };

            try {
              await updatePipeline.mutateAsync({
                payload,
                accessToken,
              });

              toast({
                title: "Pipeline is saved",
                variant: "alert-success",
                size: "small",
              });

              setTimeout(() => {
                confirmNavigation();
              }, 1000);
            } catch (error) {
              if (isAxiosError(error)) {
                toast({
                  title: "Something went wrong when save the pipeline",
                  description: getInstillApiErrorMessage(error),
                  variant: "alert-error",
                  size: "large",
                });
              } else {
                toast({
                  title: "Something went wrong when save the pipeline",
                  variant: "alert-error",
                  size: "large",
                });
              }
            }
            return;
          }

          const payload: CreateUserPipelinePayload = {
            id: pipelineId,
            recipe: constructPipelineRecipe(nodes),
          };

          try {
            await createPipeline.mutateAsync({
              userName: `users/${entity}`,
              payload,
              accessToken,
            });

            toast({
              title: "Successfully saved the pipeline",
              variant: "alert-success",
              size: "small",
            });
          } catch (error) {
            if (isAxiosError(error)) {
              toast({
                title: "Something went wrong when save the pipeline",
                description: getInstillApiErrorMessage(error),
                variant: "alert-error",
                size: "large",
              });
            } else {
              toast({
                title: "Something went wrong when save the pipeline",
                variant: "alert-error",
                size: "large",
              });
            }
          }
        }}
      />
    </div>
  );
};
