"use client";

import { Button, Icons, Resizable, Separator } from "@instill-ai/design-system";

import { PageBase } from "../../components";
import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { ComponentCmdk } from "./cmdk";
import { EditorProvider } from "./EditorContext";
import { Flow } from "./flow";
import { Input } from "./Input";
import { Output } from "./Output";
import { PipelineNamePopover } from "./PipelineNamePopover";
import { RunButton } from "./RunButton";
import { VscodeEditor } from "./VscodeEditor";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const RecipeEditorView = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery,
  });

  return (
    <PageBase>
      <div className="flex flex-row px-3 py-2 bg-semantic-bg-secondary">
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
        <div className="flex flex-row"></div>
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
