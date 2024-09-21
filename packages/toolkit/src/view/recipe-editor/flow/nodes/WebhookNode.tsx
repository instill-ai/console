"use client";

import * as React from "react";
import { NodeProps, useEdges } from "reactflow";

import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { NodeBase } from "./NodeBase";

const selector = (store: InstillStore) => ({
  selectedComponentId: store.selectedComponentId,
  showWebhook: store.showWebhook,
});

export const WebhookNode = ({ id }: NodeProps) => {
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

  const { selectedComponentId, showWebhook } = useInstillStore(
    useShallow(selector),
  );

  const isSelected = selectedComponentId === id;

  return showWebhook ? (
    <NodeBase
      id={id}
      isSelected={isSelected}
      handleOpenDocumentation={() => {}}
      handleOpenComponentOutput={() => {}}
      disabledOpenComponentOutputButton={true}
      handleClick={() => {}}
      hasTargetEdges={hasTargetEdges}
      hasSourceEdges={hasSourceEdges}
      definitionId="webhook"
      definitionTitle="Webhook"
    ></NodeBase>
  ) : null;
};
