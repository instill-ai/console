"use client";

import { Resizable } from "@instill-ai/design-system";

import { AppTopbar, PageBase } from "../../components";
import {
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUserPipeline,
} from "../../lib";
import { Editor } from "./Editor";
import { Flow } from "./flow";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const RecipeEditorView = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();

  const pipeline = useUserPipeline({
    pipelineName: routeInfo.isSuccess ? routeInfo.data.pipelineName : null,
    accessToken,
    enabled: enabledQuery,
  });

  return (
    <PageBase>
      <AppTopbar topbarControllerChildren={<></>} disabledTopbarNav={true} />
      <PageBase.Container>
        <div className="flex w-full h-[calc(100vh-var(--topbar-controller-height))] flex-row">
          <Resizable.PanelGroup direction="horizontal" className="w-full">
            <Resizable.Panel defaultSize={50} minSize={25}>
              <Editor recipe={pipeline.data?.rawRecipe ?? null} />
            </Resizable.Panel>
            <Resizable.Handle />
            <Resizable.Panel defaultSize={50} minSize={25}>
              <Flow
                pipelineId={pipeline.data?.id ?? null}
                recipe={pipeline.data?.recipe ?? null}
                pipelineMetadata={pipeline.data?.metadata ?? null}
              />
            </Resizable.Panel>
          </Resizable.PanelGroup>
        </div>
      </PageBase.Container>
    </PageBase>
  );
};
