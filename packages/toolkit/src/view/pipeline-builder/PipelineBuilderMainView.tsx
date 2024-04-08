"use client";

import cn from "clsx";
import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { Logo } from "@instill-ai/design-system";
import { ReactFlowInstance } from "reactflow";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useAppEntity,
  useSmartHint,
  useUserPipeline,
} from "../../lib";
import {
  BottomBar,
  Flow,
  RightPanel,
  usePipelineBuilderGraph,
  useSavePipeline,
} from ".";
import {
  AppTopbar,
  PageBase,
  WarnUnsavedChangesDialog,
} from "../../components";
import { TopControlMenu } from "./components/top-control-menu";
import { useRouter } from "next/navigation";

const selector = (store: InstillStore) => ({
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  pipelineIsNew: store.pipelineIsNew,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updatePipelineOpenAPIOutputSchema: store.updatePipelineOpenAPIOutputSchema,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  initPipelineBuilder: store.initPipelineBuilder,
  warnUnsavedChangesDialogState: store.warnUnsavedChangesDialogState,
  updateWarnUnsavdChangesDialogState: store.updateWarnUnsavdChangesDialogState,
});

export const PipelineBuilderMainView = () => {
  const router = useRouter();
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);

  const {
    pipelineIsNew,
    currentAdvancedConfigurationNodeID,
    updatePipelineOpenAPIOutputSchema,
    accessToken,
    enabledQuery,
    initPipelineBuilder,
    warnUnsavedChangesDialogState,
    updateWarnUnsavdChangesDialogState,
  } = useInstillStore(useShallow(selector));

  useSmartHint();

  const emtity = useAppEntity();

  const pipeline = useUserPipeline({
    enabled: enabledQuery && emtity.isSuccess && !pipelineIsNew,
    pipelineName: emtity.data.pipelineName,
    accessToken,
    retry: false,
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess) return;

    updatePipelineOpenAPIOutputSchema(
      () => pipeline.data.data_specification?.output ?? null
    );
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

  const savePipeline = useSavePipeline();

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />}>
        <TopControlMenu reactFlowInstance={reactFlowInstance} />
      </AppTopbar>
      <PageBase.Container>
        <div className="flex w-full flex-col">
          {/* 
            Pipeline builder main canvas
          */}

          <div className="pipeline-builder flex h-[calc(100vh-var(--topbar-height)-var(--pipeline-builder-bottom-bar-height))] w-full flex-row overflow-x-hidden bg-semantic-bg-base-bg">
            <Flow
              ref={reactFlowWrapper}
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
              isLoading={graphIsInitialized ? false : true}
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
            <BottomBar />
          </div>

          {/* 
            Warn unsaved changes modal
          */}

          <WarnUnsavedChangesDialog
            open={warnUnsavedChangesDialogState.open}
            setOpen={(open) => {
              updateWarnUnsavdChangesDialogState((prev) => ({
                ...prev,
                open,
              }));
            }}
            onCancel={() => {
              updateWarnUnsavdChangesDialogState(() => ({
                open: false,
                confirmNavigation: null,
              }));
            }}
            onDiscard={() => {
              initPipelineBuilder();
              if (warnUnsavedChangesDialogState.confirmNavigation) {
                warnUnsavedChangesDialogState.confirmNavigation();
              }
            }}
            onSave={async () => {
              await savePipeline();
              if (warnUnsavedChangesDialogState.confirmNavigation) {
                warnUnsavedChangesDialogState.confirmNavigation();
              }
            }}
          />
        </div>
      </PageBase.Container>
    </PageBase>
  );
};
