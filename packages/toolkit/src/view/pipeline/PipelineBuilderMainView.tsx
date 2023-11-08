import cn from "clsx";
import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@instill-ai/design-system";
import { ReactFlowInstance } from "reactflow";
import { isAxiosError } from "axios";

import {
  CreateUserPipelinePayload,
  GeneralPageProp,
  InstillStore,
  Nullable,
  UpdateUserPipelinePayload,
  getInstillApiErrorMessage,
  useCreateUserPipeline,
  useInstillStore,
  useNavigationObserver,
  usePipelineBuilderGraph,
  useSmartHint,
  useUpdateUserPipeline,
  useUserPipeline,
} from "../../lib";
import {
  BottomBar,
  Flow,
  RightPanel,
  composePipelineMetadataFromNodes,
  constructPipelineRecipe,
} from "../pipeline-builder";
import { WarnUnsavedChangesModal } from "../../components";
import { getPipelineInputOutputSchema } from "../pipeline-builder/lib/getPipelineInputOutputSchema";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  pipelineId: store.pipelineId,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  pipelineIsNew: store.pipelineIsNew,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updatePipelineOpenAPIOutputSchema: store.updatePipelineOpenAPIOutputSchema,
  updateAccessToken: store.updateAccessToken,
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
    pipelineId,
    pipelineRecipeIsDirty,
    pipelineIsNew,
    selectedConnectorNodeId,
    updatePipelineOpenAPIOutputSchema,
    updateAccessToken,
  } = useInstillStore(useShallow(selector));

  useSmartHint();

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

  const pipeline = useUserPipeline({
    enabled: enableQuery && !!id && !pipelineIsNew,
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    retry: false,
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess) return;

    const { outputSchema } = getPipelineInputOutputSchema(
      pipeline.data.openapi_schema
    );

    updatePipelineOpenAPIOutputSchema(() => outputSchema);
  }, [pipeline.isSuccess, pipeline.data, updatePipelineOpenAPIOutputSchema]);

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
   * Initialize the pipeline graph
   * -----------------------------------------------------------------------*/

  const { graphIsInitialized } = usePipelineBuilderGraph({
    enableQuery,
    accessToken,
  });

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
              metadata: composePipelineMetadataFromNodes(nodes),
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
            metadata: composePipelineMetadataFromNodes(nodes),
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
