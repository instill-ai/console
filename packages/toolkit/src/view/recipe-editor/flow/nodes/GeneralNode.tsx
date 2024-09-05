"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";
import { NodeProps, Position, useEdges } from "reactflow";
import YAML from "yaml";

import { Button, cn, Icons, Tooltip } from "@instill-ai/design-system";

import { ImageWithFallback, LoadingSpin } from "../../../../components";
import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { GeneralNodeData } from "../../../pipeline-builder";
import { CustomHandle } from "./CustomHandle";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  editorRef: store.editorRef,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
  selectedComponentId: store.selectedComponentId,
  updateSelectedComponentId: store.updateSelectedComponentId,
  triggerPipelineStreamMap: store.triggerPipelineStreamMap,
});

type ComponentErrorState =
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
    };

export const GeneralNode = ({ data, id }: NodeProps<GeneralNodeData>) => {
  const reactflowEdges = useEdges();
  const hasTargetEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.target === id && edge.source !== "variable",
    );
  }, [reactflowEdges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.source === id && edge.target !== "response",
    );
  }, [id, reactflowEdges]);

  const {
    accessToken,
    enabledQuery,
    editorRef,
    updateEditorMultiScreenModel,
    selectedComponentId,
    updateSelectedComponentId,
    triggerPipelineStreamMap,
  } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const isSelected = selectedComponentId === id;

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  const handleClick = React.useCallback(() => {
    if (!pipeline.isSuccess || !editorRef) {
      return;
    }

    updateSelectedComponentId(() => id);

    if (!pipeline.data.rawRecipe) {
      return;
    }

    const lineCounter = new YAML.LineCounter();
    const doc = YAML.parseAllDocuments<YAML.YAMLMap>(pipeline.data.rawRecipe, {
      lineCounter,
    });

    if (!doc || !doc[0]) {
      return;
    }

    const node = doc[0].getIn(["component", id], true) as YAML.Node;

    if (node && node.range) {
      const pos = lineCounter.linePos(node.range[0]);
      const adjustedLine =
        node instanceof YAML.Scalar ? pos.line : pos.line - 1;

      editorRef.setPosition({
        lineNumber: adjustedLine,
        column: 0,
      });

      // We need this happen after the editor is updated
      setTimeout(() => {
        editorRef.focus();
      });
    }
  }, [
    id,
    editorRef,
    pipeline.isSuccess,
    pipeline.data,
    updateSelectedComponentId,
  ]);

  const handleOpenDocumentation = React.useCallback(() => {
    let documentationUrl: Nullable<string> = null;

    if (!data.definition) {
      return;
    }

    const urlPrefix = "https://www.instill.tech/docs/component";
    const viewId = `${id}-documentation-view`;
    const viewTitle = `${data.definition.title} Documentation`;

    switch (data.definition.type) {
      case "COMPONENT_TYPE_OPERATOR":
        documentationUrl = urlPrefix + `/operator/${data.definition.id}`;
        break;
      case "COMPONENT_TYPE_AI":
        documentationUrl = urlPrefix + `/ai/${data.definition.id}`;
        break;
      case "COMPONENT_TYPE_DATA":
        documentationUrl = urlPrefix + `/data/${data.definition.id}`;
        break;
      case "COMPONENT_TYPE_APPLICATION":
        documentationUrl = urlPrefix + `/application/${data.definition.id}`;
        break;
      case "COMPONENT_TYPE_GENERIC":
        documentationUrl = urlPrefix + `/generic/${data.definition.id}`;
        break;
    }

    if (!documentationUrl) {
      return;
    }

    // Purely render docs only without any interaction
    documentationUrl = documentationUrl + "?isOnlyForConsoleRenderingDocs=true";

    updateEditorMultiScreenModel((prev) => ({
      ...prev,
      topRight: {
        ...prev.topRight,
        views: [
          ...prev.topRight.views.filter((view) => view.id !== viewId),
          {
            id: viewId,
            type: "docs",
            view: (
              <iframe
                title={documentationUrl}
                sandbox="allow-scripts allow-same-origin"
                src={documentationUrl}
                className="w-full h-full bg-semantic-bg-primary"
              />
            ),
            title: viewTitle,
            closeable: true,
          },
        ],
        currentViewId: viewId,
      },
    }));
  }, [id, data, updateEditorMultiScreenModel]);

  const errorState = React.useMemo<ComponentErrorState>(() => {
    if (!triggerPipelineStreamMap || !triggerPipelineStreamMap.component) {
      return {
        error: false,
      };
    }

    const component = triggerPipelineStreamMap.component[id];

    if (!component) {
      return {
        error: false,
      };
    }

    let beautifyError: Nullable<string> = null;

    try {
      beautifyError = JSON.stringify(component.error?.message, null, 2);
    } catch (error) {
      console.error(error);
    }

    if (component.status?.errored) {
      return {
        error: true,
        message: beautifyError ? beautifyError : component.error?.message,
      };
    }

    return {
      error: false,
    };
  }, [triggerPipelineStreamMap, id]);

  const isProcessing = React.useMemo(() => {
    if (!triggerPipelineStreamMap || !triggerPipelineStreamMap.component) {
      return false;
    }

    const component = triggerPipelineStreamMap.component[id];

    if (!component) {
      return false;
    }

    if (
      component.status?.started &&
      !component.status?.errored &&
      !component.status.completed
    ) {
      return true;
    }

    return false;
  }, [triggerPipelineStreamMap, id]);

  const isCompleted = React.useMemo(() => {
    if (!triggerPipelineStreamMap || !triggerPipelineStreamMap.component) {
      return false;
    }

    const component = triggerPipelineStreamMap.component[id];

    if (!component) {
      return false;
    }

    if (component.status && component.status.completed) {
      return true;
    }

    return false;
  }, [triggerPipelineStreamMap, id]);

  return (
    <div className="relative nowheel">
      <div
        className={cn(
          "top-0 w-full flex absolute h-10 -translate-y-full duration-300 transition-opacity ease-in-out",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex flex-row mx-auto gap-x-2.5">
          <Button
            disabled={true}
            variant="tertiaryGrey"
            className="!px-2 opacity-0 pointer-events-none"
          >
            <Icons.Play className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
          <Button
            disabled={true}
            variant="tertiaryGrey"
            className="!px-2 opacity-0"
          >
            <Icons.Trash01 className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
          <Button
            disabled={!isSelected}
            onClick={handleOpenDocumentation}
            variant="tertiaryGrey"
            className="!px-2"
          >
            <Icons.Logout04 className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
        </div>
      </div>
      <div
        onClick={handleClick}
        className={cn(
          "flex relative items-center border-2 border-[#94a0b8] justify-center w-[160px] h-[160px] flex-col rounded p-3 bg-semantic-bg-base-bg",
          isCompleted ? "border-4 border-semantic-success-default" : "",
          errorState.error ? "border-4 border-semantic-error-default" : "",
        )}
      >
        {isProcessing ? (
          <div className="absolute right-2 bottom-2">
            <LoadingSpin className="w-6 h-6 text-semantic-fg-primary" />
          </div>
        ) : null}
        {errorState.error && (
          <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Icons.AlertTriangle className="w-6 h-6 right-2 bottom-2 absolute stroke-semantic-error-default" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="w-[200px]"
                  sideOffset={5}
                  side="bottom"
                >
                  <div className="rounded-sm bg-semantic-bg-secondary-base-bg p-3">
                    <p className="product-body-text-4-medium text-semantic-bg-primary">
                      {errorState.message}
                    </p>
                  </div>
                  <Tooltip.Arrow
                    className="fill-semantic-bg-secondary-base-bg"
                    offset={5}
                    width={9}
                    height={6}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
        <div className="flex flex-row items-center justify-center">
          <ImageWithFallback
            src={`/icons/${data.definition?.id}.svg`}
            width={80}
            height={80}
            alt={`${data.definition?.title}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-20 w-20 stroke-semantic-fg-primary" />
            }
          />
        </div>
        <CustomHandle
          className={hasTargetEdges ? "" : "!opacity-0"}
          type="target"
          position={Position.Left}
          id={id}
        />
        <CustomHandle
          className={hasSourceEdges ? "" : "!opacity-0"}
          type="source"
          position={Position.Right}
          id={id}
        />
      </div>
      <div
        className={cn(
          "bottom-0 w-full flex flex-col absolute translate-y-full gap-y-2",
        )}
      >
        <div className="flex flex-col">
          <p className="product-body-text-3-medium w-full text-center text-semantic-fg-disabled">
            {id}
          </p>
          <p className="product-body-text-4-regular text-semantic-fg-disabled w-full text-center">
            {data.task}
          </p>
        </div>
        {data.description ? (
          <div
            className={cn(
              "bg-semantic-warning-bg shadow-xxs p-2 duration-300 transition-opacity ease-in-out",
              isSelected ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="product-body-text-4-medium text-semantic-fg-disabled">
              {data.description}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
