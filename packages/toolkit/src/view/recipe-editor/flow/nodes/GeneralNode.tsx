"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";
import { NodeProps, Position, useEdges } from "reactflow";

import { Button, cn, Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../components";
import {
  InstillStore,
  isConnectorDefinition,
  isOperatorDefinition,
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
  triggerWithStreamData: store.triggerWithStreamData,
  editorRef: store.editorRef,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
  selectedComponentId: store.selectedComponentId,
  updateSelectedComponentId: store.updateSelectedComponentId,
});

export const GeneralNode = ({ data, id }: NodeProps<GeneralNodeData>) => {
  const reactflowEdges = useEdges();
  const hasTargetEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.target === id && edge.source !== "variable",
    );
  }, [reactflowEdges, id]);

  console.log(reactflowEdges);

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.source === id && edge.target !== "response",
    );
  }, [id, reactflowEdges]);

  const {
    accessToken,
    enabledQuery,
    triggerWithStreamData,
    editorRef,
    updateEditorMultiScreenModel,
    selectedComponentId,
    updateSelectedComponentId,
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

  const isFinished = React.useMemo(() => {
    const targetTrace = triggerWithStreamData.find((data) => {
      if (!data.metadata.traces) {
        return false;
      }
      const traceKey = Object.keys(data.metadata.traces)[0];
      return traceKey === id;
    });

    if (targetTrace) {
      return true;
    } else {
      false;
    }
  }, [triggerWithStreamData, id]);

  const handleClick = React.useCallback(() => {
    if (!pipeline.isSuccess || !editorRef) {
      return;
    }

    updateSelectedComponentId(() => id);

    if (!pipeline.data.rawRecipe) {
      return;
    }

    const yamlSourceMap: SourceMap = new SourceMap();

    try {
      yaml.load(pipeline.data.rawRecipe, {
        listener: yamlSourceMap.listen(),
      });
    } catch (error) {
      console.log(error);
      return;
    }

    const targetPos = yamlSourceMap.lookup(`component.${id}`);

    if (targetPos) {
      editorRef.setPosition({
        lineNumber: targetPos.line - 1,
        column: targetPos.column,
      });

      setTimeout(() => {
        editorRef.focus();
      }, 1);
    }
  }, [editorRef, pipeline.isSuccess]);

  const handleOpenDocumentation = React.useCallback(() => {
    let documentationUrl: Nullable<string> = null;

    if (!data.definition) {
      return;
    }

    const urlPrefix = "https://www.instill.tech/docs/component";
    const viewId = `${id}-documentation-view`;
    const viewTitle = `${data.definition.title} Documentation`;

    console.log(data.definition);

    if (isOperatorDefinition(data.definition)) {
      documentationUrl = urlPrefix + `/operator/${data.definition.id}`;
    }

    if (isConnectorDefinition(data.definition)) {
      switch (data.definition.type) {
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
  }, [data]);

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
            variant="tertiaryGrey"
            className="!px-2 opacity-0 pointer-events-none"
          >
            <Icons.Play className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
          <Button
            disabled={!isSelected}
            variant="tertiaryGrey"
            className="!px-2"
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
          "flex items-center justify-center w-[160px] h-[160px] flex-col rounded p-3 bg-semantic-bg-base-bg",
          isFinished ? "bg-semantic-success-bg" : "",
        )}
        style={{
          border: "1px solid #94a0b8",
        }}
      >
        <div className="flex flex-row items-center justify-center">
          <ImageWithFallback
            src={`/icons/${data.definition?.id}.svg`}
            width={96}
            height={96}
            alt={`${data.definition?.title}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-24 w-24 stroke-semantic-fg-primary" />
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
          "bottom-0 w-full flex absolute translate-y-full duration-300 transition-opacity ease-in-out",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="product-body-text-3-medium w-full text-center text-semantic-fg-disabled">
          {id}
        </p>
      </div>
    </div>
  );
};
