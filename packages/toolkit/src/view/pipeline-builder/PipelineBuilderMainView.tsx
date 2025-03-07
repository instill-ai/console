"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import cn from "clsx";
import { ReactFlowInstance } from "reactflow";
import { useShallow } from "zustand/react/shallow";

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
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useNamespacePipeline,
  useNamespaceSecrets,
  useRouteInfo,
  useSmartHint,
} from "../../lib";
import { TopControlMenu } from "./components/top-control-menu";

const selector = (store: InstillStore) => ({
  pipelineIsNew: store.pipelineIsNew,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updatePipelineOpenAPIOutputSchema: store.updatePipelineOpenAPIOutputSchema,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  initPipelineBuilder: store.initPipelineBuilder,
  warnUnsavedChangesDialogState: store.warnUnsavedChangesDialogState,
  updateWarnUnsavdChangesDialogState: store.updateWarnUnsavdChangesDialogState,
  updateEntitySecrets: store.updateEntitySecrets,
});

export const PipelineBuilderMainView = ({
  namespaceSwitch,
}: {
  namespaceSwitch: React.ReactNode;
}) => {
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
    updateEntitySecrets,
  } = useInstillStore(useShallow(selector));

  useSmartHint();

  const routeInfo = useRouteInfo();

  const entitySecrets = useNamespaceSecrets({
    namespaceId: routeInfo.data.namespaceId,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  React.useEffect(() => {
    if (!entitySecrets.isSuccess) return;
    updateEntitySecrets(() => entitySecrets.data);
  }, [entitySecrets.isSuccess, entitySecrets.data, updateEntitySecrets]);

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    enabled: enabledQuery && routeInfo.isSuccess && !pipelineIsNew,
    accessToken,
    view: "VIEW_FULL",
    shareCode: null,
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess) return;

    updatePipelineOpenAPIOutputSchema(
      () => pipeline.data.dataSpecification?.output ?? null,
    );
  }, [pipeline.isSuccess, pipeline.data, updatePipelineOpenAPIOutputSchema]);

  React.useEffect(() => {
    if (!pipeline.isSuccess) {
      return;
    }

    if (!pipeline.data.permission.canEdit) {
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
      <AppTopbar
        topbarControllerChildren={
          <TopControlMenu
            className="pl-3"
            reactFlowInstance={reactFlowInstance}
          />
        }
        namespaceSwitch={namespaceSwitch}
        disabledTopbarNav={true}
      />
      <PageBase.Container>
        <div className="flex w-full flex-col">
          {/* 
            Pipeline editor main canvas
          */}

          <div className="pipeline-builder bg-semantic-bg-base-bg flex h-[calc(100vh-var(--topbar-controller-height)-var(--pipeline-builder-bottom-bar-height))] w-full flex-row overflow-x-hidden">
            <Flow
              ref={reactFlowWrapper}
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
              isLoading={graphIsInitialized ? false : true}
              isError={!pipelineIsNew && pipeline.isError}
            />
            <div
              className={cn(
                "border-semantic-bg-line bg-semantic-bg-primary fixed left-full w-[450px] transform overflow-y-scroll rounded-sm border p-6 shadow-sm duration-500",
                "h-[calc(100vh-var(--topbar-controller-height)-var(--pipeline-builder-bottom-bar-height)-var(--pipeline-builder-minimap-height)-var(--pipeline-builder-top-right-controler-height)-calc(4*var(--pipeline-builder-controller-padding)))]",
                "top-[calc(var(--topbar-controller-height)+var(--pipeline-builder-top-right-controler-height)+calc(2*var(--pipeline-builder-controller-padding)))]",
                currentAdvancedConfigurationNodeID
                  ? "-translate-x-[450px]"
                  : "",
              )}
            >
              <RightPanel />
            </div>
          </div>

          {/* 
            Pipeline editor bottom bar
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
              if (warnUnsavedChangesDialogState.confirmNavigation) {
                warnUnsavedChangesDialogState.confirmNavigation();
              }
              initPipelineBuilder();
            }}
            onSave={async () => {
              await savePipeline();
              initPipelineBuilder();
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
