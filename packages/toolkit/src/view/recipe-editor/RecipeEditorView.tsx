"use client";

import { Button, Icons, Resizable, Separator } from "@instill-ai/design-system";

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
import { Flow } from "./flow";
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
});

export const RecipeEditorView = () => {
  const { accessToken, enabledQuery, updateOpenCmdk } = useInstillStore(
    useShallow(selector),
  );
  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery,
  });

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
          <div className="flex h-[calc(100vh-var(--topbar-controller-height))] w-full flex-col">
            <ComponentCmdk />
            <Resizable.PanelGroup direction="horizontal" className="w-full">
              <Resizable.Panel defaultSize={50} minSize={25}>
                <VscodeEditor />
              </Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel defaultSize={50} minSize={25}>
                <Resizable.PanelGroup direction="vertical">
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
