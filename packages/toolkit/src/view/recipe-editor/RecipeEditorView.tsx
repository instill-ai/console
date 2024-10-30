"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import { Nullable } from "instill-sdk";
import { ErrorBoundary } from "react-error-boundary";

import {
  Button,
  cn,
  Icons,
  ImperativePanelHandle,
  Resizable,
} from "@instill-ai/design-system";

import { LoadingSpin, PageBase } from "../../components";
import { CETopbarDropdown } from "../../components/top-bar/CETopbarDropdown";
import { CloudTopbarDropdown } from "../../components/top-bar/CloudTopbarDropdown";
import {
  DefaultEditorViewIDs,
  EditorView,
  InstillStore,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
  useSortedReleases,
} from "../../lib";
import { env } from "../../server";
import { PublishPipelineDialog } from "../pipeline-builder";
import { ActionCmdk, ComponentCmdo } from "./commands";
import { PipelineToolkitDialog, SharePipelineDialog } from "./dialogs";
import { ImportRecipeDialog } from "./dialogs/ImportRecipeDialog";
import { EditorButtonTooltipWrapper } from "./EditorButtonTooltipWrapper";
import { EditorProvider } from "./EditorContext";
import { EditorViewSectionBar } from "./EditorViewSectionBar";
import { fitViewOptions, Flow } from "./flow";
import { getGettingStartedEditorView } from "./getting-started-view";
import { InOutputEmptyView } from "./InOutputEmptyView";
import { Input } from "./input/Input";
import { prettifyYaml, useEditorCommandListener } from "./lib";
import { Output } from "./Output";
import {
  PipelineNamePopover,
  ReleasedVersionPopover,
  ReleasePopover,
} from "./popovers";
import { PreviewEmptyView } from "./PreviewEmptyView";
import { RunButton } from "./RunButton";
import { Sidebar } from "./sidebar";

// Dynamic load this component to solve hydration error
const VscodeEditor = dynamic(
  () => import("./VscodeEditor").then((mod) => mod.VscodeEditor),
  { ssr: false },
);

const sidebarDefaultSize = 15;
const leftPanelDefaultSize = 45;
// const rightPanelDefaultSize = 40;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateOpenActionCmdk: store.updateOpenActionCmdk,
  editorMultiScreenModel: store.editorMultiScreenModel,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
  editorRef: store.editorRef,
  rawRecipeOnDom: store.rawRecipeOnDom,
  updateRawRecipeOnDom: store.updateRawRecipeOnDom,
  hasUnsavedRecipe: store.hasUnsavedRecipe,
  isSavingRecipe: store.isSavingRecipe,
  updateCurrentVersion: store.updateCurrentVersion,
  currentVersion: store.currentVersion,
  editorPreviewReactFlowInstance: store.editorPreviewReactFlowInstance,
  updateTriggerPipelineStreamMap: store.updateTriggerPipelineStreamMap,
});

export const RecipeEditorView = () => {
  const router = useRouter();
  const {
    accessToken,
    enabledQuery,
    editorMultiScreenModel,
    updateEditorMultiScreenModel,
    editorRef,
    rawRecipeOnDom,
    updateRawRecipeOnDom,
    hasUnsavedRecipe,
    isSavingRecipe,
    updateCurrentVersion,
    currentVersion,
    editorPreviewReactFlowInstance,
    updateTriggerPipelineStreamMap,
  } = useInstillStore(useShallow(selector));
  useEditorCommandListener();
  const routeInfo = useRouteInfo();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [currentExpandView, setCurrentExpandView] =
    React.useState<Nullable<"left" | "topRight" | "bottomRight">>(null);
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();
  const [isInitialized, setIsInitialized] = React.useState(false);

  const sidebarRef = React.useRef<ImperativePanelHandle>(null);
  const leftPanelRef = React.useRef<ImperativePanelHandle>(null);
  const rightPanelRef = React.useRef<ImperativePanelHandle>(null);
  const topRightPanelRef = React.useRef<ImperativePanelHandle>(null);
  const bottomRightPanelRef = React.useRef<ImperativePanelHandle>(null);
  const editorContainerRef = React.useRef<HTMLDivElement>(null);

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabled: enabledQuery,
    view: "VIEW_FULL",
    shareCode: null,
  });

  // redirect to 404 if the pipeline is not found
  React.useEffect(() => {
    if (pipeline.isError) {
      router.push("/404");
    }
  }, [pipeline.isError, router]);

  // re-layout the editor when window size changes
  React.useEffect(() => {
    const handleResize = () => {
      if (editorRef && editorContainerRef.current) {
        const newHeight =
          // 40 is the height of the release popover and the gap at the bottom
          window.innerHeight - editorContainerRef.current.offsetTop - 40;
        editorRef.layout({
          width: editorContainerRef.current.offsetWidth,
          height: newHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    // Call handleResize initially to set the correct size
    handleResize();
  }, [editorRef]);

  const sortedReleases = useSortedReleases({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    shareCode: null,
    view: "VIEW_FULL",
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess || isInitialized) {
      return;
    }

    updateRawRecipeOnDom(() => pipeline.data.rawRecipe);
    updateTriggerPipelineStreamMap(() => null);
    setIsInitialized(true);
  }, [
    pipeline.isSuccess,
    pipeline.data,
    updateRawRecipeOnDom,
    isInitialized,
    updateTriggerPipelineStreamMap,
  ]);

  React.useEffect(() => {
    updateCurrentVersion(() => "latest");
  }, [updateCurrentVersion]);

  React.useEffect(() => {
    if (!pipeline.isSuccess) {
      return;
    }

    const targetPipeline =
      currentVersion === "latest"
        ? pipeline.data
        : sortedReleases.data?.find((e) => e.id === currentVersion);

    const release = sortedReleases.data?.find((e) => e.id === currentVersion);

    const recipe =
      currentVersion === "latest" ? pipeline.data.recipe : release?.recipe;
    const dataSpecification =
      currentVersion === "latest"
        ? pipeline.data.dataSpecification
        : release?.dataSpecification;

    const inputView = recipe?.variable ? (
      <Input fields={recipe?.variable ?? null} />
    ) : (
      <InOutputEmptyView reason="variableIsEmpty" />
    );

    const previewView = recipe ? (
      <ErrorBoundary fallbackRender={() => <PreviewEmptyView />}>
        <Flow
          pipelineId={pipeline.data?.id ?? null}
          recipe={recipe ?? null}
          pipelineMetadata={targetPipeline?.metadata ?? null}
        />
      </ErrorBoundary>
    ) : (
      <PreviewEmptyView />
    );

    const outputView =
      dataSpecification?.output &&
      dataSpecification.output?.properties &&
      Object.keys(dataSpecification.output?.properties).length !== 0 ? (
        <Output outputSchema={dataSpecification?.output ?? null} />
      ) : (
        <InOutputEmptyView reason="outputIsEmpty" />
      );

    const pipelineIsNew = pipeline.data.metadata.pipelineIsNew ?? false;

    updateEditorMultiScreenModel((prev) => {
      const topRightViews: EditorView[] = [
        {
          id: DefaultEditorViewIDs.MAIN_PREVIEW_FLOW,
          title: "Preview",
          type: "preview",
          view: previewView,
          closeable: false,
        },
        ...(prev.topRight?.views.filter(
          (view) => view.id !== DefaultEditorViewIDs.MAIN_PREVIEW_FLOW,
        ) ?? []),
      ];

      if (
        pipelineIsNew &&
        prev.topRight?.views.findIndex(
          (e) => e.id === DefaultEditorViewIDs.GETTING_STARTED,
        ) === -1
      ) {
        topRightViews.push(getGettingStartedEditorView());
      }

      return {
        topRight: {
          views: topRightViews,
          currentViewId: pipelineIsNew
            ? DefaultEditorViewIDs.GETTING_STARTED
            : (prev.topRight?.currentViewId ??
              DefaultEditorViewIDs.MAIN_PREVIEW_FLOW),
        },
        main: {
          views: [],
          currentViewId: null,
        },
        bottomRight: {
          views: [
            {
              id: DefaultEditorViewIDs.MAIN_INPUT,
              title: "Input",
              type: "input",
              view: inputView,
              closeable: false,
            },
            {
              id: DefaultEditorViewIDs.MAIN_OUTPUT,
              title: "Output",
              type: "output",
              view: outputView,
              closeable: false,
            },
          ],
          currentViewId:
            prev.bottomRight?.currentViewId ?? DefaultEditorViewIDs.MAIN_INPUT,
        },
      };
    });
  }, [
    pipeline.data,
    pipeline.isSuccess,
    updateEditorMultiScreenModel,
    currentVersion,
    sortedReleases.isSuccess,
    sortedReleases.data,
  ]);

  const isCloud = env("NEXT_PUBLIC_APP_ENV") === "CLOUD";

  const handleDownload = React.useCallback(async () => {
    if (pipeline.isSuccess && pipeline.data?.rawRecipe) {
      let prettifiedRecipe: Nullable<string> = null;

      try {
        prettifiedRecipe = await prettifyYaml(pipeline.data.rawRecipe);
      } catch (error) {
        prettifiedRecipe = pipeline.data.rawRecipe;
        console.error(error);
      }

      const blob = new Blob([prettifiedRecipe], {
        type: "text/plain;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pipeline.data.id}_recipe.yaml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [pipeline.isSuccess, pipeline.data]);

  return (
    <PageBase>
      <div className="flex flex-row px-3 h-12 items-center bg-semantic-bg-secondary">
        <div className="flex flex-row w-1/2">
          <div className="flex flex-row gap-x-2">
            <EditorButtonTooltipWrapper
              tooltipContent={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              <Button
                size="sm"
                className="!w-8 !h-8 items-center justify-center"
                onClick={() => {
                  if (
                    sidebarRef.current &&
                    sidebarRef.current?.getSize() === 0
                  ) {
                    sidebarRef.current?.resize(sidebarDefaultSize);
                    setIsSidebarOpen(true);
                    return;
                  }

                  if (isSidebarOpen) {
                    sidebarRef.current?.resize(0);
                    setIsSidebarOpen(false);
                  } else {
                    sidebarRef.current?.resize(sidebarDefaultSize);
                    setIsSidebarOpen(true);
                  }
                }}
                variant="tertiaryGrey"
              >
                <Icons.LayoutLeft className="w-4 h-4 stroke-semantic-fg-primary" />
              </Button>
            </EditorButtonTooltipWrapper>

            <EditorButtonTooltipWrapper tooltipContent="Go to overview page">
              <Button
                size="sm"
                className="!w-8 !h-8 items-center justify-center"
                variant="tertiaryGrey"
                onClick={() => {
                  navigate(
                    `/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}/playground`,
                  );
                }}
              >
                <Icons.ArrowLeft className="w-4 h-4 stroke-semantic-fg-primary" />
              </Button>
            </EditorButtonTooltipWrapper>

            <PipelineNamePopover sharing={pipeline.data?.sharing ?? null} />
          </div>
          <div className="flex flex-1 flex-row gap-x-2 items-center justify-end">
            <ComponentCmdo />
            <ImportRecipeDialog />
            <RunButton />
          </div>
        </div>
        <div className="flex flex-row gap-x-2 w-1/2 justify-end">
          <ActionCmdk />
          <PipelineToolkitDialog />
          <SharePipelineDialog />
          <PublishPipelineDialog />
          <ReleasePopover />
          <div className="ml-4 flex">
            {isCloud ? <CloudTopbarDropdown /> : <CETopbarDropdown />}
          </div>
        </div>
      </div>
      <PageBase.Container>
        <EditorProvider>
          <div className="flex h-[calc(100vh-var(--topbar-controller-height))] bg-semantic-bg-secondary w-full flex-row px-2 py-1.5">
            <div className="h-full w-full transition-all ease-in-out duration-300">
              <Resizable.PanelGroup direction="horizontal" className="w-full">
                <Resizable.Panel
                  id="sidebar"
                  ref={sidebarRef}
                  defaultSize={sidebarDefaultSize}
                  maxSize={20}
                >
                  <Sidebar
                    pipelineComponentMap={
                      pipeline.data?.recipe?.component ?? null
                    }
                    pipelineVariableFieldMap={
                      pipeline.data?.recipe?.variable ?? null
                    }
                    pipelineOutputFieldMap={
                      pipeline.data?.recipe?.output ?? null
                    }
                  />
                </Resizable.Panel>
                <Resizable.Handle
                  className={cn(
                    "opacity-0 w-1 data-[resize-handle-active]:opacity-100",
                    currentExpandView === "topRight" ||
                      currentExpandView === "bottomRight"
                      ? "hidden"
                      : "",
                  )}
                  onDragging={() => {
                    setCurrentExpandView(null);
                  }}
                />
                <Resizable.Panel
                  id="left-panel"
                  ref={leftPanelRef}
                  defaultSize={45}
                >
                  <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row justify-between border-b border-semantic-bg-line rounded-tr bg-semantic-bg-base-bg h-8 items-center">
                      <div className="flex flex-row px-1.5 h-full box-border items-center border-t border-semantic-accent-default gap-x-1.5 bg-semantic-bg-alt-primary">
                        <Icons.Pipeline className="w-4 h-4 stroke-semantic-accent-default" />
                        <span className="text-[13px] font-sans text-semantic-fg-primary">
                          {pipeline.data?.id ?? null}
                        </span>
                        {isSavingRecipe ? (
                          <LoadingSpin className="!w-3 !h-3 !text-semantic-fg-secondary" />
                        ) : hasUnsavedRecipe ? (
                          <div className="w-2 h-2 shrink-0 grow-0 rounded-full bg-semantic-bg-line" />
                        ) : null}
                      </div>
                      <div className="flex flex-row">
                        <EditorButtonTooltipWrapper
                          tooltipContent={
                            currentExpandView === "left"
                              ? "Minimize panel"
                              : "Maximize panel"
                          }
                        >
                          <button
                            className="p-1.5"
                            onClick={() => {
                              if (currentExpandView === "left") {
                                rightPanelRef.current?.resize(
                                  leftPanelDefaultSize,
                                );
                                setCurrentExpandView(null);
                              } else {
                                rightPanelRef.current?.resize(0);
                                setCurrentExpandView("left");
                              }
                            }}
                          >
                            {currentExpandView === "left" ? (
                              <Icons.Minimize01 className="w-3 h-3 stroke-semantic-fg-primary" />
                            ) : (
                              <Icons.Expand01 className="w-3 h-3 stroke-semantic-fg-primary" />
                            )}
                          </button>
                        </EditorButtonTooltipWrapper>

                        <EditorButtonTooltipWrapper tooltipContent="Download recipe">
                          <button className="p-1.5" onClick={handleDownload}>
                            <Icons.Download01 className="w-3 h-3 stroke-semantic-fg-primary" />
                          </button>
                        </EditorButtonTooltipWrapper>
                      </div>
                    </div>
                    <div className="flex h-7 shrink-0 items-center flex-row-reverse bg-semantic-bg-alt-primary border-b border-semantic-bg-line">
                      <EditorButtonTooltipWrapper tooltipContent="Format recipe">
                        <button
                          onClick={async () => {
                            if (!rawRecipeOnDom || !editorRef) {
                              return;
                            }

                            const model = editorRef.getModel();

                            if (!model) {
                              return;
                            }

                            let prettifiedRecipe: Nullable<string> = null;
                            const currentPosition = editorRef?.getPosition();

                            try {
                              prettifiedRecipe =
                                await prettifyYaml(rawRecipeOnDom);
                            } catch (error) {
                              prettifiedRecipe = rawRecipeOnDom;
                              console.error(error);
                            }

                            // Replace the entire content
                            model.pushEditOperations(
                              [],
                              [
                                {
                                  range: model.getFullModelRange(),
                                  text: prettifiedRecipe,
                                },
                              ],
                              () => null,
                            );

                            // Restore the cursor position
                            if (currentPosition) {
                              editorRef?.setPosition(currentPosition);
                            }
                          }}
                          className="flex flex-row items-center gap-x-1 px-1"
                        >
                          <Icons.AlignLeft className="w-3 h-3 stroke-semantic-fg-secondary" />
                          <span className="text-xs font-sans text-semantic-fg-secondary">
                            Format
                          </span>
                        </button>
                      </EditorButtonTooltipWrapper>
                    </div>

                    <div className="w-full flex-1 bg-semantic-bg-primary">
                      <div
                        id="editor-past-version-hint"
                        className={cn(
                          "flex p-1.5 w-full flex-col bg-semantic-bg-base-bg",
                          currentVersion !== "latest" && pipeline.isSuccess
                            ? ""
                            : "hidden",
                        )}
                      >
                        <p className="product-body-text-3-medium break-words">
                          <span className="text-semantic-fg-secondary">
                            You are viewing a past version of this pipeline,
                            which is not editable.
                          </span>
                          {` `}
                          <span
                            className="cursor-pointer text-semantic-accent-default hover:!underline"
                            onClick={() => {
                              if (!pipeline.isSuccess || !editorRef) {
                                return;
                              }

                              // We first update the value then update the version to latest
                              // Because the guard of the recipe updater will check whether the
                              // version is latest, if we don't have this delay, the updater will
                              // get wrongly trigger
                              editorRef.setValue(pipeline.data.rawRecipe ?? "");

                              // Because the past version hint is listening to the version change,
                              // so we need to bundle the layout update and version update together
                              setTimeout(() => {
                                if (!editorContainerRef.current) {
                                  return;
                                }

                                const editorLayoutInfo =
                                  editorRef.getLayoutInfo();

                                const newHeight =
                                  window.innerHeight -
                                  editorContainerRef.current?.offsetTop -
                                  // 40 is the height of the release popover and the gap at the bottom
                                  40 +
                                  // 52 is the height of the past version hint
                                  52;

                                editorRef.layout({
                                  width: editorLayoutInfo.width,
                                  height: newHeight,
                                });
                                updateCurrentVersion(() => "latest");
                              }, 1);
                            }}
                          >
                            Click Here
                          </span>
                          {` `}
                          <span className="text-semantic-fg-secondary">
                            for the latest version.
                          </span>
                        </p>
                      </div>
                      <div ref={editorContainerRef} className="flex flex-1">
                        <VscodeEditor />
                      </div>
                      <div className="h-7 shrink-0 flex flex-row bg-semantic-bg-alt-primary">
                        <ReleasedVersionPopover
                          editorContainerRef={editorContainerRef}
                        />
                      </div>
                    </div>
                  </div>
                </Resizable.Panel>
                <Resizable.Handle
                  className="opacity-0 w-1 data-[resize-handle-active]:opacity-100"
                  onDragging={() => {
                    setCurrentExpandView(null);
                  }}
                />
                <Resizable.Panel
                  id="right-panel"
                  ref={rightPanelRef}
                  defaultSize={40}
                >
                  <Resizable.PanelGroup direction="vertical">
                    <Resizable.Panel
                      id="top-right-panel"
                      ref={topRightPanelRef}
                      defaultSize={50}
                    >
                      <div className="flex flex-col w-full h-full rounded-b">
                        <EditorViewSectionBar
                          views={editorMultiScreenModel.topRight?.views ?? []}
                          currentViewId={
                            editorMultiScreenModel.topRight?.currentViewId ??
                            null
                          }
                          isExpanded={currentExpandView === "topRight"}
                          onToggleExpand={() => {
                            if (currentExpandView === "topRight") {
                              leftPanelRef.current?.resize(
                                leftPanelDefaultSize,
                              );
                              bottomRightPanelRef.current?.resize(50);
                              setCurrentExpandView(null);
                            } else {
                              leftPanelRef.current?.resize(0);
                              bottomRightPanelRef.current?.resize(0);
                              setCurrentExpandView("topRight");
                            }

                            if (
                              editorMultiScreenModel.topRight.currentViewId ===
                              DefaultEditorViewIDs.MAIN_PREVIEW_FLOW
                            ) {
                              // We need this happen after the view is updated
                              setTimeout(() => {
                                editorPreviewReactFlowInstance?.fitView(
                                  fitViewOptions,
                                );
                              });
                            }
                          }}
                          onDragEnd={(event) => {
                            const { active, over } = event;

                            if (!editorMultiScreenModel.topRight) {
                              return;
                            }

                            const newViews =
                              editorMultiScreenModel.topRight.views;

                            if (over && active.id !== over.id) {
                              const oldIndex =
                                editorMultiScreenModel.topRight.views.findIndex(
                                  (e) => e.id === active.id,
                                );
                              const newIndex =
                                editorMultiScreenModel.topRight.views.findIndex(
                                  (e) => e.id === over.id,
                                );

                              const movedNewViews = arrayMove(
                                newViews,
                                oldIndex,
                                newIndex,
                              );

                              if (movedNewViews.length > 0) {
                                updateEditorMultiScreenModel((prev) => ({
                                  ...prev,
                                  topRight: {
                                    views: movedNewViews,
                                    currentViewId:
                                      prev.topRight?.currentViewId ?? null,
                                  },
                                }));
                              }
                            }
                          }}
                          onClick={(id) => {
                            updateEditorMultiScreenModel((prev) => ({
                              ...prev,
                              topRight: {
                                ...prev.topRight,
                                currentViewId: id,
                              },
                            }));
                          }}
                          onDelete={(id) => {
                            updateEditorMultiScreenModel((prev) => ({
                              ...prev,
                              topRight: {
                                views: prev.topRight.views.filter(
                                  (view) => view.id !== id,
                                ),
                                currentViewId:
                                  DefaultEditorViewIDs.MAIN_PREVIEW_FLOW,
                              },
                            }));
                          }}
                        />
                        <div className="rounded-b w-full h-full overflow-y-auto bg-semantic-bg-alt-primary">
                          {editorMultiScreenModel.topRight.views.map((view) => (
                            <div
                              key={view.id}
                              className={cn(
                                "flex w-full h-full overflow-auto",
                                view.id ===
                                  editorMultiScreenModel.topRight?.currentViewId
                                  ? ""
                                  : "hidden",
                              )}
                            >
                              {view.view}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Resizable.Panel>
                    <Resizable.Handle className="opacity-0 !h-1 data-[resize-handle-active]:opacity-100" />
                    <Resizable.Panel
                      id="bottom-right-panel"
                      ref={bottomRightPanelRef}
                      defaultSize={50}
                    >
                      <div className="flex flex-col w-full h-full">
                        <EditorViewSectionBar
                          views={
                            editorMultiScreenModel.bottomRight?.views ?? []
                          }
                          isExpanded={currentExpandView === "bottomRight"}
                          currentViewId={
                            editorMultiScreenModel.bottomRight?.currentViewId ??
                            null
                          }
                          onToggleExpand={() => {
                            if (currentExpandView === "bottomRight") {
                              leftPanelRef.current?.resize(
                                leftPanelDefaultSize,
                              );
                              topRightPanelRef.current?.resize(50);
                              setCurrentExpandView(null);
                            } else {
                              leftPanelRef.current?.resize(0);
                              topRightPanelRef.current?.resize(0);
                              setCurrentExpandView("bottomRight");
                            }
                          }}
                          onDragEnd={(event) => {
                            const { active, over } = event;

                            if (!editorMultiScreenModel.bottomRight) {
                              return;
                            }

                            const newViews =
                              editorMultiScreenModel.bottomRight.views;

                            if (over && active.id !== over.id) {
                              const oldIndex =
                                editorMultiScreenModel.bottomRight.views.findIndex(
                                  (e) => e.id === active.id,
                                );
                              const newIndex =
                                editorMultiScreenModel.bottomRight.views.findIndex(
                                  (e) => e.id === over.id,
                                );

                              const movedNewViews = arrayMove(
                                newViews,
                                oldIndex,
                                newIndex,
                              );

                              if (movedNewViews.length > 0) {
                                updateEditorMultiScreenModel((prev) => ({
                                  ...prev,
                                  bottomRight: {
                                    views: movedNewViews,
                                    currentViewId:
                                      prev.bottomRight?.currentViewId ?? null,
                                  },
                                }));
                              }
                            }
                          }}
                          onClick={(id) => {
                            updateEditorMultiScreenModel((prev) => ({
                              ...prev,
                              bottomRight: {
                                ...prev.bottomRight,
                                currentViewId: id,
                              },
                            }));
                          }}
                          onDelete={(id) => {
                            updateEditorMultiScreenModel((prev) => ({
                              ...prev,
                              bottomRight: {
                                views: prev.bottomRight.views.filter(
                                  (view) => view.id !== id,
                                ),
                                currentViewId: DefaultEditorViewIDs.MAIN_INPUT,
                              },
                            }));
                          }}
                        />
                        <div className="w-full h-full rounded-b bg-semantic-bg-alt-primary px-4 overflow-y-auto">
                          {editorMultiScreenModel.bottomRight.views.map(
                            (view) => (
                              <div
                                key={view.id}
                                className={cn(
                                  "flex w-full h-full",
                                  view.id ===
                                    editorMultiScreenModel.bottomRight
                                      ?.currentViewId
                                    ? ""
                                    : "hidden",
                                )}
                              >
                                {view.view}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </Resizable.Panel>
                  </Resizable.PanelGroup>
                </Resizable.Panel>
              </Resizable.PanelGroup>
            </div>
          </div>
        </EditorProvider>
      </PageBase.Container>
    </PageBase>
  );
};
