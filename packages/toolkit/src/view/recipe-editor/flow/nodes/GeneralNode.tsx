"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";
import { NodeProps, useEdges } from "reactflow";
import YAML from "yaml";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import {
  GeneralNodeData,
  getGeneralComponentInOutputSchema,
} from "../../../pipeline-builder";
import { ComponentOutputView } from "./ComponentOutputView";
import { NodeBase } from "./NodeBase";

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
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    view: "VIEW_FULL",
    shareCode: null,
  });

  const handleClick = React.useCallback(() => {
    updateSelectedComponentId(() => id);

    if (!pipeline.isSuccess || !editorRef || !pipeline.data.rawRecipe) {
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

      editorRef.revealLineInCenter(adjustedLine);

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

    if (!data.definition || !data.definition.documentationUrl) {
      return;
    }

    const viewId = `${id}-documentation-view`;
    const viewTitle = `${data.definition.title} Documentation`;

    // Purely render docs only without any interaction
    documentationUrl =
      data.definition.documentationUrl + "?isOnlyForConsoleRenderingDocs=true";

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

  const handleOpenComponentOutput = React.useCallback(() => {
    const viewId = `${id}-output-view`;
    const viewTitle = `${data.definition?.title} Output`;

    const { outputSchema } = getGeneralComponentInOutputSchema(data, data.task);

    updateEditorMultiScreenModel((prev) => ({
      ...prev,
      bottomRight: {
        ...prev.bottomRight,
        views: [
          ...prev.bottomRight.views.filter((view) => view.id !== viewId),
          {
            id: viewId,
            type: "output",
            view: <ComponentOutputView id={id} outputSchema={outputSchema} />,
            title: viewTitle,
            closeable: true,
          },
        ],
        currentViewId: viewId,
      },
    }));
  }, [id, data, updateEditorMultiScreenModel]);

  return (
    <NodeBase
      id={id}
      isSelected={isSelected}
      isProcessing={isProcessing}
      isCompleted={isCompleted}
      errorState={errorState}
      handleOpenDocumentation={handleOpenDocumentation}
      handleOpenComponentOutput={handleOpenComponentOutput}
      handleClick={handleClick}
      hasTargetEdges={hasTargetEdges}
      hasSourceEdges={hasSourceEdges}
      nodeDescription={data.description}
      definitionId={data.definition?.id}
      definitionTitle={data.definition?.title}
    />
  );
};
