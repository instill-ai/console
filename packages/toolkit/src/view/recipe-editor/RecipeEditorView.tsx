"use client";

import React from "react";
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
  InstillStore,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { ComponentCmdk } from "./cmdk";
import { EditorProvider } from "./EditorContext";
import { EditorViewSectionBar } from "./EditorViewSectionBar";
import { Flow } from "./flow";
import { InOutputEmptyView } from "./InOutputEmptyView";
import { Input } from "./Input";
import { Output } from "./Output";
import { PipelineNamePopover } from "./PipelineNamePopover";
import { prettifyYaml } from "./prettifyYaml";
import { ReleasePopover } from "./ReleasePopover";
import { RunButton } from "./RunButton";
import { ShareDialogTrigger } from "./ShareDialogTrigger";
import { Sidebar } from "./sidebar";
import { ToolkitDialogTrigger } from "./ToolkitDialogTrigger";
import { VscodeEditor } from "./VscodeEditor";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateOpenCmdk: store.updateOpenCmdk,
  editorMultiScreenModel: store.editorMultiScreenModel,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
  editorRef: store.editorRef,
});

export const RecipeEditorView = () => {
  const {
    accessToken,
    enabledQuery,
    updateOpenCmdk,
    editorMultiScreenModel,
    updateEditorMultiScreenModel,
    editorRef,
  } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [currentExpandView, setCurrentExpandView] =
    React.useState<Nullable<"left" | "topRight" | "bottomRight">>(null);
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();
  const [unsavedRawRecipe, setUnsavedRawRecipe] =
    React.useState<Nullable<string>>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
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

    setUnsavedRawRecipe(pipeline.data.rawRecipe);
  }, [pipeline.isSuccess, pipeline.data]);

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
      <InOutputEmptyView />
    );

    const outputView = pipeline.data?.dataSpecification?.output ? (
      <Output
        id="test"
        outputSchema={pipeline.data?.dataSpecification?.output ?? null}
      />
    ) : (
      <InOutputEmptyView />
    );

    updateEditorMultiScreenModel(() => ({
      topRight: {
        views: [
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
        ],
        currentViewId: "main-preview-flow",
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
        currentViewId: "main-input",
      },
    }));
  }, [pipeline.data, pipeline.isSuccess]);

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
      link.download = `${pipeline.data.id}_recipe.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [pipeline.isSuccess, pipeline.data]);

  return (
    <PageBase>
      <div className="flex flex-row px-3 h-12 items-center bg-semantic-bg-secondary">
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
        <div className="flex flex-1 items-center justify-center">
          <RunButton />
        </div>
        <div className="flex flex-row gap-x-2">
          <button
            onClick={() => {
              updateOpenCmdk(() => true);
            }}
            className="flex flex-row gap-x-2 h-8 rounded border border-semantic-bg-line bg-semantic-bg-primary items-center px-2"
          >
            <Icons.SearchSm className="w-4 h-4 stroke-semantic-fg-primary" />
            <span
              className="product-body-text-3-regular"
              style={{ color: "#1D2433CC" }}
            >
              Search...
            </span>
            <div className="border flex border-semantic-bg-line rounded h-6 bg-semantic-bg-alt-primary px-1">
              <span
                className="product-body-text-3-regular my-auto"
                style={{ color: "#1D2433CC" }}
              >
                ⌘K
              </span>
            </div>
          </button>
          <ToolkitDialogTrigger />
          <ShareDialogTrigger />
          <ReleasePopover />
        </div>
        <div className="ml-4 flex">
          {isCloud ? <CloudTopbarDropdown /> : <CETopbarDropdown />}
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
                pipelineId={pipeline.data?.id ?? null}
              />
            </div>
            <ComponentCmdk />
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
                        {isSaving ? (
                          <LoadingSpin className="!w-3 !h-3 !text-semantic-fg-secondary" />
                        ) : hasUnsavedChanges ? (
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
                          if (!unsavedRawRecipe || !editorRef) {
                            return;
                          }

                          let prettifiedRecipe: Nullable<string> = null;

                          try {
                            prettifiedRecipe =
                              await prettifyYaml(unsavedRawRecipe);
                          } catch (error) {
                            prettifiedRecipe = unsavedRawRecipe;
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
                    <div className="w-full h-full bg-semantic-bg-primary">
                      <VscodeEditor
                        unsavedRawRecipe={unsavedRawRecipe}
                        setUnsavedRawRecipe={setUnsavedRawRecipe}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                        setIsSaving={setIsSaving}
                      />
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
                        <div className="rounded-b w-full h-full overflow-hidden bg-semantic-bg-alt-primary">
                          {editorMultiScreenModel.topRight.views.map((view) => (
                            <div
                              key={view.id}
                              className={cn(
                                "flex w-full h-full",
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
                        <div className="w-full h-full rounded-b bg-semantic-bg-alt-primary px-4 overflow-hidden">
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
