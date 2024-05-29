"use client";

import cn from "clsx";
import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { ReactFlowInstance } from "reactflow";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useRouteInfo,
  useSmartHint,
  useUserPipeline,
  useUserSecrets,
} from "../../lib";
import {
  BottomBar,
  BottomDrawer,
  Cmdk,
  Flow,
  LeftSideBar,
  RightPanel,
  useAddNodeWithDefinition,
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
  pipelineIsNew: store.pipelineIsNew,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updatePipelineOpenAPIOutputSchema: store.updatePipelineOpenAPIOutputSchema,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  initPipelineBuilder: store.initPipelineBuilder,
  warnUnsavedChangesDialogState: store.warnUnsavedChangesDialogState,
  updateWarnUnsavdChangesDialogState: store.updateWarnUnsavdChangesDialogState,
  updateEntitySecrets: store.updateEntitySecrets,
  leftSideBarIsOpen: store.leftSidebarIsOpen,
  bottomDrawerIsOpen: store.bottomDrawerIsOpen,
  displayResultOnRightPanel: store.displayResultOnRightPanel,
});

export const PipelineBuilderMainView = () => {
  const router = useRouter();
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const addNode = useAddNodeWithDefinition({ reactFlowInstance });
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
    leftSideBarIsOpen,
    bottomDrawerIsOpen,
    displayResultOnRightPanel,
  } = useInstillStore(useShallow(selector));

  useSmartHint();

  const routeInfo = useRouteInfo();

  const entitySecrets = useUserSecrets({
    entityName: routeInfo.data.namespaceName,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  React.useEffect(() => {
    if (!entitySecrets.isSuccess) return;
    updateEntitySecrets(() => entitySecrets.data);
  }, [entitySecrets.isSuccess, entitySecrets.data, updateEntitySecrets]);

  const pipeline = useUserPipeline({
    enabled: enabledQuery && routeInfo.isSuccess && !pipelineIsNew,
    pipelineName: routeInfo.data.pipelineName,
    accessToken,
    retry: false,
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
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />}>
        <TopControlMenu />
      </AppTopbar>
      <PageBase.Container>
        <div className="flex w-full flex-col">
          <Cmdk
            onSelect={(definition) => {
              addNode(definition);
            }}
          />
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
                "border-semantic-bg-line bg-semantic-bg-primary fixed left-full z-50 h-[calc(100vh-var(--topbar-height)-var(--pipeline-builder-bottom-bar-height))] w-[450px] transform overflow-y-auto border-b border-r p-6 py-6 duration-500",
                currentAdvancedConfigurationNodeID || displayResultOnRightPanel
                  ? "-translate-x-[450px]"
                  : "",
              )}
            >
              <RightPanel />
            </div>

            <div
              className={cn(
                "fixed left-0 top-full z-50 h-[var(--pipeline-builder-bottom-drawer-height)] w-full transform duration-500",
                bottomDrawerIsOpen
                  ? "-translate-y-[var(--pipeline-builder-bottom-drawer-height)]"
                  : "",
              )}
            >
              <BottomDrawer />
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
