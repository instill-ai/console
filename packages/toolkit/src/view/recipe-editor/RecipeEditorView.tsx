"use client";

import React from "react";
import dynamic from "next/dynamic";
import { arrayMove } from "@dnd-kit/sortable";
import { Nullable } from "instill-sdk";

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
  EditorView,
  InstillStore,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { ActionCmdk, ComponentCmdo } from "./commands";
import { PipelineToolkitDialog, SharePipelineDialog } from "./dialogs";
import { ImportRecipeDialog } from "./dialogs/ImportRecipeDialog";
import { EditorProvider } from "./EditorContext";
import { EditorViewSectionBar } from "./EditorViewSectionBar";
import { Flow } from "./flow";
import { gettingStartedEditorView } from "./getting-started-view";
import { InOutputEmptyView } from "./InOutputEmptyView";
import { Input } from "./input/Input";
import { prettifyYaml, useEditorCommandListener } from "./lib";
import { Output } from "./Output";
import {
  PipelineNamePopover,
  ReleasedVersionPopover,
  ReleasePopover,
} from "./popovers";
import { RunButton } from "./RunButton";
import { Sidebar } from "./sidebar";

// Dynamic load this component to solve hydration error
const VscodeEditor = dynamic(
  () => import("./VscodeEditor").then((mod) => mod.VscodeEditor),
  { ssr: false },
);

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
});

export const RecipeEditorView = () => {
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
  } = useInstillStore(useShallow(selector));
  useEditorCommandListener();
  const routeInfo = useRouteInfo();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [currentExpandView, setCurrentExpandView] =
    React.useState<Nullable<"left" | "topRight" | "bottomRight">>(null);
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

  const leftPanelRef = React.useRef<ImperativePanelHandle>(null);
  const rightPanelRef = React.useRef<ImperativePanelHandle>(null);
  const topRightPanelRef = React.useRef<ImperativePanelHandle>(null);
  const bottomRightPanelRef = React.useRef<ImperativePanelHandle>(null);

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery,
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess) {
      return;
    }

    updateRawRecipeOnDom(() => pipeline.data.rawRecipe);
  }, [pipeline.isSuccess, pipeline.data, updateRawRecipeOnDom]);

  React.useEffect(() => {
    updateCurrentVersion(() => "latest");
  }, [updateCurrentVersion]);

  React.useEffect(() => {
    if (!pipeline.isSuccess) {
      return;
    }

    const inputView = pipeline.data?.recipe.variable ? (
      <Input
        pipelineName={pipeline.data?.name ?? null}
        fields={pipeline.data?.recipe.variable ?? null}
      />
    ) : (
      <InOutputEmptyView reason="variableIsEmpty" />
    );

    const outputView =
      pipeline.data?.dataSpecification?.output &&
      pipeline.data.dataSpecification.output?.properties &&
      Object.keys(pipeline.data.dataSpecification.output?.properties).length !==
        0 ? (
        <Output
          outputSchema={pipeline.data?.dataSpecification?.output ?? null}
        />
      ) : (
        <InOutputEmptyView reason="outputIsEmpty" />
      );

    let pipelineIsNew = false;

    if (
      !pipeline.data.recipe.component &&
      !pipeline.data.recipe.variable &&
      !pipeline.data.recipe.output
    ) {
      pipelineIsNew = true;
    }

    updateEditorMultiScreenModel((prev) => {
      const topRightViews: EditorView[] = [
        {
          id: "main-preview-flow",
          title: "Preview",
          type: "preview",
          view: (
            <Flow
              pipelineId={pipeline.data?.id ?? null}
              recipe={pipeline.data?.recipe ?? null}
              pipelineMetadata={pipeline.data?.metadata ?? null}
            />
          ),
          closeable: false,
        },
        ...(prev.topRight?.views.filter(
          (view) => view.id !== "main-preview-flow",
        ) ?? []),
      ];

      if (pipelineIsNew) {
        topRightViews.push(gettingStartedEditorView);
      }

      return {
        topRight: {
          views: topRightViews,
          currentViewId: pipelineIsNew
            ? "getting-started"
            : (prev.topRight?.currentViewId ?? "main-preview-flow"),
        },
        main: {
          views: [],
          currentViewId: null,
        },
        bottomRight: {
          views: [
            {
              id: "main-input",
              title: "Input",
              type: "input",
              view: inputView,
              closeable: false,
            },
            {
              id: "main-output",
              title: "Output",
              type: "output",
              view: outputView,
              closeable: false,
            },
          ],
          currentViewId: prev.bottomRight?.currentViewId ?? "main-input",
        },
      };
    });
  }, [pipeline.data, pipeline.isSuccess, updateEditorMultiScreenModel]);

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
            <Button
              size="sm"
              className="!w-8 !h-8 items-center justify-center"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              variant="tertiaryGrey"
            >
              <Icons.LayoutLeft className="w-4 h-4 stroke-semantic-fg-primary" />
            </Button>
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
          <ReleasePopover />
          <div className="ml-4 flex">
            {isCloud ? <CloudTopbarDropdown /> : <CETopbarDropdown />}
          </div>
        </div>
      </div>
      <PageBase.Container>
        <EditorProvider>
          <div className="flex h-[calc(100vh-var(--topbar-controller-height))] bg-semantic-bg-secondary w-full flex-row px-2 py-1.5">
            <div
              className={cn(
                "h-[calc(100vh-var(--topbar-controller-height)-12px)] transition-transform duration-300 top-[var(--topbar-controller-height)] absolute left-0 pb-2",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <Sidebar
                pipelineComponentMap={pipeline.data?.recipe.component ?? null}
                pipelineVariableFieldMap={
                  pipeline.data?.recipe.variable ?? null
                }
                pipelineOutputFieldMap={pipeline.data?.recipe?.output ?? null}
              />
            </div>

            <div
              className={cn(
                "h-full transition-all ease-in-out duration-300",
                isSidebarOpen
                  ? "ml-[280px] w-[calc(100%-280px)]"
                  : "ml-0 w-full",
              )}
            >
              <Resizable.PanelGroup direction="horizontal" className="w-full">
                <Resizable.Panel
                  id="left-panel"
                  ref={leftPanelRef}
                  defaultSize={50}
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
                        <button
                          className="p-1.5"
                          onClick={() => {
                            if (currentExpandView === "left") {
                              rightPanelRef.current?.resize(50);
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
                        <button className="p-1.5" onClick={handleDownload}>
                          <Icons.Download01 className="w-3 h-3 stroke-semantic-fg-primary" />
                        </button>
                      </div>
                    </div>
                    <div className="flex h-7 shrink-0 items-center flex-row-reverse bg-semantic-bg-alt-primary border-b border-semantic-bg-line">
                      <button
                        onClick={async () => {
                          if (!rawRecipeOnDom || !editorRef) {
                            return;
                          }

                          let prettifiedRecipe: Nullable<string> = null;

                          try {
                            prettifiedRecipe =
                              await prettifyYaml(rawRecipeOnDom);
                          } catch (error) {
                            prettifiedRecipe = rawRecipeOnDom;
                            console.error(error);
                          }

                          if (prettifiedRecipe) {
                            editorRef?.setValue(prettifiedRecipe);
                          }
                        }}
                        className="flex flex-row items-center gap-x-1 px-1"
                      >
                        <Icons.AlignLeft className="w-3 h-3 stroke-semantic-fg-secondary" />
                        <span className="text-xs font-sans text-semantic-fg-secondary">
                          Format
                        </span>
                      </button>
                    </div>
                    {currentVersion !== "latest" && pipeline.isSuccess ? (
                      <div className="flex p-1.5 w-full flex-col bg-semantic-bg-base-bg">
                        <p className="product-body-text-3-medium break-words">
                          <span className="text-semantic-fg-secondary">
                            You are viewing a past version of this pipeline,
                            which is not editable.
                          </span>
                          {` `}
                          <span
                            className="cursor-pointer text-semantic-accent-default hover:!underline"
                            onClick={() => {
                              if (!pipeline.isSuccess) {
                                return;
                              }

                              updateCurrentVersion(() => "latest");
                              updateRawRecipeOnDom(
                                () => pipeline.data.rawRecipe,
                              );
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
                    ) : null}
                    <div className="w-full flex-1 bg-semantic-bg-primary">
                      <VscodeEditor />
                    </div>
                    <div className="h-7 shrink-0 flex flex-row bg-semantic-bg-alt-primary">
                      <ReleasedVersionPopover />
                    </div>
                  </div>
                </Resizable.Panel>
                <Resizable.Handle
                  className={cn("opacity-0", currentExpandView ? "" : "mr-3")}
                />
                <Resizable.Panel
                  id="right-panel"
                  ref={rightPanelRef}
                  defaultSize={50}
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
                              leftPanelRef.current?.resize(50);
                              bottomRightPanelRef.current?.resize(50);
                              setCurrentExpandView(null);
                            } else {
                              leftPanelRef.current?.resize(0);
                              bottomRightPanelRef.current?.resize(0);
                              setCurrentExpandView("topRight");
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
                                currentViewId: "main-preview-flow",
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
                    <Resizable.Handle className="mb-2 opacity-0" />
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
                              leftPanelRef.current?.resize(50);
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
                                currentViewId: "main-input",
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
