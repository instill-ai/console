"use client";

import * as React from "react";
import { NodeProps, useEdges } from "reactflow";

import { Button, cn, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { EditorButtonTooltipWrapper } from "../../EditorButtonTooltipWrapper";
import { NodeBase } from "./NodeBase";
import { WebhookURLView } from "./WebhookURLView";

const selector = (store: InstillStore) => ({
  selectedComponentId: store.selectedComponentId,
  featureFlagWebhookEnabled: store.featureFlagWebhookEnabled,
  flowIsUnderDemoMode: store.flowIsUnderDemoMode,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateSelectedComponentId: store.updateSelectedComponentId,
});

export const RunOnEventNode = ({ id }: NodeProps) => {
  const routeInfo = useRouteInfo();
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
    selectedComponentId,
    featureFlagWebhookEnabled,
    flowIsUnderDemoMode,
    updateEditorMultiScreenModel,
    accessToken,
    enabledQuery,
    updateSelectedComponentId,
  } = useInstillStore(useShallow(selector));

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  const isSelected = selectedComponentId === id;

  const handleClick = React.useCallback(() => {
    updateSelectedComponentId(() => id);
  }, [id, updateSelectedComponentId]);

  const handleOpenWebhookURL = React.useCallback(() => {
    if (
      !pipeline.isSuccess ||
      !pipeline.data.endpoints ||
      !pipeline.data.endpoints.webhooks
    ) {
      return;
    }

    const viewId = `${id}-webhook`;
    const viewTitle = `${id} Webhook URL`;

    const targetUrl = pipeline.data.endpoints.webhooks[id]?.url;

    if (!targetUrl) {
      return;
    }

    updateEditorMultiScreenModel((prev) => ({
      ...prev,
      bottomRight: {
        ...prev.bottomRight,
        views: [
          ...prev.bottomRight.views.filter((view) => view.id !== viewId),
          {
            id: viewId,
            type: "output",
            view: <WebhookURLView url={targetUrl} />,
            title: viewTitle,
            closeable: true,
          },
        ],
        currentViewId: viewId,
      },
    }));
  }, [id, pipeline.isSuccess, pipeline.data, updateEditorMultiScreenModel]);

  return featureFlagWebhookEnabled ? (
    <NodeBase
      id={id}
      isSelected={isSelected}
      handleOpenDocumentation={() => {}}
      handleOpenComponentOutput={() => {}}
      disabledOpenDocumentationButton={true}
      disabledOpenComponentOutputButton={true}
      handleClick={handleClick}
      hasTargetEdges={hasTargetEdges}
      hasSourceEdges={hasSourceEdges}
      definitionId="webhook"
      definitionTitle="Webhook"
      additionalControlButton={
        flowIsUnderDemoMode ? null : (
          <EditorButtonTooltipWrapper tooltipContent="Open Webhook URL">
            <Button
              disabled={!isSelected}
              variant="tertiaryGrey"
              onClick={handleOpenWebhookURL}
              className={cn("!px-2", isSelected ? "" : "opacity-0")}
            >
              <Icons.Settings02 className="w-4 h-4 stroke-semantic-fg-primary" />
            </Button>
          </EditorButtonTooltipWrapper>
        )
      }
    >
      <div
        className="absolute rounded-full top-0 left-0 p-2 bg-semantic-bg-secondary -translate-x-1/2 -translate-y-1/2"
        style={{
          border: "1px solid #AF89FA",
        }}
      >
        <Icons.Lightning02 className="w-4 h-4 stroke-semantic-secondary-hover" />
      </div>
    </NodeBase>
  ) : null;
};
