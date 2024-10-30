"use client";

import * as React from "react";

import {
  Button,
  Dialog,
  Icons,
  ScrollArea,
  Tabs,
} from "@instill-ai/design-system";

import { CodeBlock } from "../../../components";
import {
  generatePipelineHttpInputStringFromRecipe,
  getInstillPipelineHttpRequestExample,
} from "../../../constant/pipeline";
import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
  useSortedReleases,
} from "../../../lib";
import { EditorButtonTooltipWrapper } from "../EditorButtonTooltipWrapper";

const tabTriggerStyle =
  "rounded-t-sm border border-semantic-bg-line bg-semantic-bg-base-bg px-3 py-1.5 text-[#1D2433] text-opacity-80 product-body-text-3-semibold data-[state=active]:bg-semantic-bg-primary data-[state=active]:text-opacity-100";
const tabContentStyle =
  "h-full w-full rounded-sm border border-semantic-bg-line bg-semantic-accent-bg p-2";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  currentVersion: store.currentVersion,
});

export const PipelineToolkitDialog = () => {
  const [toolKitIsOpen, setToolKitIsOpen] = React.useState(false);
  const routeInfo = useRouteInfo();

  const { accessToken, enabledQuery, currentVersion } = useInstillStore(
    useShallow(selector),
  );

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    view: "VIEW_FULL",
    shareCode: null,
  });

  const pipelineReleases = useSortedReleases({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    shareCode: null,
    view: "VIEW_FULL",
  });

  const codeSnippet = React.useMemo(() => {
    if (
      !routeInfo.isSuccess ||
      !routeInfo.data.pipelineName ||
      !pipeline.isSuccess ||
      !pipelineReleases.isSuccess
    ) {
      return "";
    }

    if (currentVersion === "latest") {
      const inputsString = generatePipelineHttpInputStringFromRecipe(
        pipeline.data.recipe,
      );

      return getInstillPipelineHttpRequestExample({
        pipelineName: routeInfo.data.pipelineName,
        inputsString,
        version: currentVersion,
      });
    } else {
      const targetRelease = pipelineReleases.data.find(
        (release) => release.id === currentVersion,
      );

      if (!targetRelease) {
        return "";
      }

      const inputsString = generatePipelineHttpInputStringFromRecipe(
        targetRelease.recipe,
      );

      return getInstillPipelineHttpRequestExample({
        pipelineName: routeInfo.data.pipelineName,
        inputsString,
        version: currentVersion,
      });
    }
  }, [
    routeInfo.isSuccess,
    routeInfo.data.pipelineName,
    pipeline.isSuccess,
    pipelineReleases.isSuccess,
    currentVersion,
    pipeline.data,
    pipelineReleases.data,
  ]);

  return (
    <Dialog.Root
      open={toolKitIsOpen}
      onOpenChange={(open) => setToolKitIsOpen(open)}
    >
      <EditorButtonTooltipWrapper tooltipContent="Toolkit">
        <Button
          size="md"
          variant="tertiaryGrey"
          className="!p-[9px] my-auto"
          onClick={() => setToolKitIsOpen((prev) => !prev)}
        >
          <Icons.CodeSquare02 className="h-[14px] w-[14px] stroke-semantic-fg-secondary" />
        </Button>
      </EditorButtonTooltipWrapper>
      <Dialog.Content className="!h-[475px] !max-w-[560px]">
        <div className="flex flex-col">
          <div className="mb-6 flex flex-row space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line">
              <Icons.CodeBrowser className="h-5 w-5 stroke-semantic-fg-primary" />
            </div>
            <div className="flex flex-col">
              <Dialog.Title>Pipeline toolkit</Dialog.Title>
              <Dialog.Description>
                The home of useful gadgets for you to better utilitze VDP
                pipeline.
              </Dialog.Description>
            </div>
          </div>
          <Tabs.Root defaultValue="snippet" className="h-[300px] w-[512px]">
            <Tabs.List className="flex w-full flex-row gap-x-0.5 px-2">
              <Tabs.Trigger className={tabTriggerStyle} value="snippet">
                Trigger Snippet
              </Tabs.Trigger>
            </Tabs.List>
            <div className="flex h-full w-full">
              <Tabs.Content className={tabContentStyle} value="snippet">
                <ScrollArea.Root
                  viewPortClassName="max-w-[496px]"
                  className="h-full"
                >
                  <CodeBlock
                    codeString={codeSnippet}
                    wrapLongLines={true}
                    language="bash"
                    className="min-h-[288px]"
                    customStyle={{
                      borderRadius: "0.5rem",
                      fontSize: "14px",
                      backgroundColor: "white",
                      width: "100%",
                      maxWidth: "496px",
                      padding: "48px 12px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  />
                </ScrollArea.Root>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};
