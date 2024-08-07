"use client";

import React from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Nullable } from "instill-sdk";

import {
  Button,
  Icons,
  ImperativePanelHandle,
  Resizable,
} from "@instill-ai/design-system";

import { PageBase } from "../../components";
import { CETopbarDropdown } from "../../components/top-bar/CETopbarDropdown";
import { CloudTopbarDropdown } from "../../components/top-bar/CloudTopbarDropdown";
import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { ComponentCmdk } from "./cmdk";
import { EditorProvider } from "./EditorContext";
import { EditorViewBarItem } from "./EditorViewBarItem";
import { Flow } from "./flow";
import { HorizontalSortableWrapper } from "./HorizontalSortableWrapper";
import { Input } from "./Input";
import { Output } from "./Output";
import { PipelineNamePopover } from "./PipelineNamePopover";
import { ReleasePopover } from "./ReleasePopover";
import { RunButton } from "./RunButton";
import { ShareDialogTrigger } from "./ShareDialogTrigger";
import { ToolkitDialogTrigger } from "./ToolkitDialogTrigger";
import { VscodeEditor } from "./VscodeEditor";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateOpenCmdk: store.updateOpenCmdk,
  editorMultiScreenModel: store.editorMultiScreenModel,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
});

export const RecipeEditorView = () => {
  const {
    accessToken,
    enabledQuery,
    updateOpenCmdk,
    editorMultiScreenModel,
    updateEditorMultiScreenModel,
  } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();
  const [currentExpandView, setCurrentExpandView] =
    React.useState<Nullable<"left" | "topRight" | "bottomRight">>("left");

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
          },
          {
            id: "main-input",
            title: "Input",
            type: "input",
            view: null,
          },
        ],
        currentViewId: "main-preview-flow",
      },
      main: null,
      bottomRight: {
        views: [
          {
            id: "main-input",
            title: "Input",
            type: "input",
            view: (
              <Input
                pipelineName={pipeline.data?.name ?? null}
                fields={pipeline.data?.recipe.variable ?? null}
              />
            ),
          },
          {
            id: "main-output",
            title: "Output",
            type: "output",
            view: (
              <Output
                id="test"
                outputSchema={pipeline.data?.dataSpecification?.output ?? null}
              />
            ),
          },
        ],
        currentViewId: "main-input",
      },
    }));
  }, [pipeline.data, pipeline.isSuccess]);

  const isCloud = env("NEXT_PUBLIC_APP_ENV") === "CLOUD";

  return (
    <PageBase>
      <div className="flex flex-row px-3 h-12 items-center bg-semantic-bg-secondary">
        <div className="flex flex-row gap-x-2">
          <Button
            size="sm"
            className="!w-8 !h-8 items-center justify-center"
            variant="tertiaryGrey"
          >
            <Icons.LayoutLeft className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
          <Button
            size="sm"
            className="!w-8 !h-8 items-center justify-center"
            variant="tertiaryGrey"
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
          <div className="flex h-[calc(100vh-var(--topbar-controller-height))] bg-semantic-bg-secondary w-full flex-col px-2 py-1.5">
            <ComponentCmdk />
            <Resizable.PanelGroup direction="horizontal" className="w-full">
              <Resizable.Panel
                id="left-panel"
                ref={leftPanelRef}
                defaultSize={50}
              >
                <VscodeEditor />
              </Resizable.Panel>
              <Resizable.Handle className="mr-3" />
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
                    minSize={25}
                  >
                    <div className="flex flex-col w-full h-full">
                      <div className="flex flex-row rounded pr-1 bg-semantic-bg-base-bg border-b border-semantic-bg-line">
                        {editorMultiScreenModel.topRight ? (
                          <HorizontalSortableWrapper
                            items={editorMultiScreenModel.topRight.views}
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
                          >
                            <div className="flex flex-1 flex-row w-full">
                              {editorMultiScreenModel.topRight.views.map(
                                (view) => (
                                  <EditorViewBarItem
                                    key={view.id}
                                    id={view.id}
                                    title={view.title}
                                    type={view.type}
                                  />
                                ),
                              )}
                            </div>
                          </HorizontalSortableWrapper>
                        ) : null}
                        <button
                          onClick={() => {
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
                        >
                          {currentExpandView === "topRight" ? (
                            <Icons.Minimize01 className="w-3 h-3 stroke-semantic-fg-primary" />
                          ) : (
                            <Icons.Expand01 className="w-3 h-3 stroke-semantic-fg-primary" />
                          )}
                        </button>
                      </div>
                      {editorMultiScreenModel.topRight
                        ? editorMultiScreenModel.topRight.views.find(
                            (view) =>
                              view.id ===
                              editorMultiScreenModel.topRight?.currentViewId,
                          )?.view
                        : null}
                    </div>
                  </Resizable.Panel>
                  <Resizable.Handle className="mb-2" />
                  <Resizable.Panel
                    id="bottom-right-panel"
                    ref={bottomRightPanelRef}
                    defaultSize={50}
                  ></Resizable.Panel>
                </Resizable.PanelGroup>
              </Resizable.Panel>
            </Resizable.PanelGroup>

            {/* <Resizable.PanelGroup direction="vertical" className="w-full">
              <Resizable.Panel defaultSize={50} minSize={25}>
                <Resizable.PanelGroup direction="horizontal">
                  <Resizable.Panel defaultSize={50} minSize={25}>
                    <Flow
                      pipelineId={pipeline.data?.id ?? null}
                      recipe={pipeline.data?.recipe ?? null}
                      pipelineMetadata={pipeline.data?.metadata ?? null}
                    />
                  </Resizable.Panel>
                  <Resizable.Handle />
                  <Resizable.Panel defaultSize={50} minSize={25}>
                    <div className="h-full w-full flex flex-row bg-white p-4">
                      <div className="flex flex-row w-1/2 p-4">
                        <Input
                          pipelineName={pipeline.data?.name ?? null}
                          fields={pipeline.data?.recipe.variable ?? null}
                        />
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row w-1/2 p-4">
                        <Output
                          id="test"
                          outputSchema={
                            pipeline.data?.dataSpecification?.output ?? null
                          }
                        />
                      </div>
                    </div>
                  </Resizable.Panel>
                </Resizable.PanelGroup>
              </Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel defaultSize={50} minSize={25}>
                <Editor
                  recipe={pipeline.data?.recipe ?? null}
                  rawRecipe={pipeline.data?.rawRecipe ?? null}
                />
              </Resizable.Panel>
            </Resizable.PanelGroup> */}
          </div>
        </EditorProvider>
      </PageBase.Container>
    </PageBase>
  );
};
