"use client";

import * as React from "react";
import { NodeProps, useEdges } from "reactflow";

import { Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { NodeBase } from "./NodeBase";

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
    updateSelectedComponentId,
  } = useInstillStore(useShallow(selector));

  const isSelected = selectedComponentId === id;

  const handleClick = React.useCallback(() => {
    updateSelectedComponentId(() => id);
  }, [id, updateSelectedComponentId]);

  return featureFlagWebhookEnabled ? (
    <NodeBase
      id={id}
      isSelected={isSelected}
      disabledOpenDocumentationButton={true}
      disabledOpenComponentOutputButton={true}
      handleClick={handleClick}
      hasTargetEdges={hasTargetEdges}
      hasSourceEdges={hasSourceEdges}
      definitionId="webhook"
      definitionTitle="Webhook"
      customHandleClassName="!border-[#AF89FA]"
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
