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
  useEntity,
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
import { WarnUnsavedChangesDialog } from "../../components";
import { getPipelineInputOutputSchema } from "../pipeline-builder/lib/getPipelineInputOutputSchema";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  pipelineId: store.pipelineId,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  pipelineIsNew: store.pipelineIsNew,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updatePipelineOpenAPIOutputSchema: store.updatePipelineOpenAPIOutputSchema,
});

export type PipelineBuilderMainViewProps = GeneralPageProp;

export const PipelineBuilderMainView = (
  props: PipelineBuilderMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);

  const {
    nodes,
    pipelineId,
    pipelineRecipeIsDirty,
    pipelineIsNew,
    currentAdvancedConfigurationNodeID,
    updatePipelineOpenAPIOutputSchema,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  useSmartHint();

  const [warnUnsaveChangesModalIsOpen, setWarnUnsaveChangesModalIsOpen] =
    React.useState(false);

  const { toast } = useToast();

  const createPipeline = useCreateUserPipeline();
  const updatePipeline = useUpdateUserPipeline();

  const { confirmNavigation } = useNavigationObserver({
    shouldStopNavigation: pipelineRecipeIsDirty ? true : false,
    onStopNavigate: () => {
      setWarnUnsaveChangesModalIsOpen(true);
    },
    router,
  });

  const { pipelineName, entityName } = useEntity();

  const pipeline = useUserPipeline({
    enabled: enableQuery && !!pipelineName && !pipelineIsNew,
    pipelineName,
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
    if (!pipeline.isSuccess) {
      return;
    }

    if (!pipeline.data.permission.can_edit) {
      router.push("/404");
    }
  }, [pipeline.isSuccess, pipeline.data, router]);

  /* -------------------------------------------------------------------------
   * Initialize the pipeline graph
   * -----------------------------------------------------------------------*/

  const { graphIsInitialized } = usePipelineBuilderGraph();

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex w-full flex-col">
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
          isError={!pipelineIsNew && pipeline.isError}
        />
        <div
          className={cn(
            "fixed left-full w-[450px] transform overflow-y-scroll rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-6 shadow-sm duration-500",
            "h-[calc(100vh-var(--topbar-height)-var(--pipeline-builder-bottom-bar-height)-var(--pipeline-builder-minimap-height)-var(--pipeline-builder-top-right-controler-height)-calc(4*var(--pipeline-builder-controller-padding)))]",
            "top-[calc(var(--topbar-height)+var(--pipeline-builder-top-right-controler-height)+calc(2*var(--pipeline-builder-controller-padding)))]",
            currentAdvancedConfigurationNodeID ? "-translate-x-[450px]" : ""
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

      <WarnUnsavedChangesDialog
        open={warnUnsaveChangesModalIsOpen}
        setOpen={setWarnUnsaveChangesModalIsOpen}
        onCancel={() => {
          setWarnUnsaveChangesModalIsOpen(false);
          updatePipelineRecipeIsDirty(() => false);
        }}
        onDiscard={() => {
          updatePipelineRecipeIsDirty(() => false);
          confirmNavigation();
        }}
        onSave={async () => {
          if (!pipelineId || !accessToken || !entityName || !pipelineName) {
            return;
          }

          if (!pipelineIsNew) {
            const payload: UpdateUserPipelinePayload = {
              name: pipelineName,
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
                updatePipelineRecipeIsDirty(() => false);
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
              entityName,
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
