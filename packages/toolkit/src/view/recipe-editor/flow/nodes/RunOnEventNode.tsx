"use client";

import * as React from "react";
import { NodeProps, useEdges } from "reactflow";

import { Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useComponentDefinitions,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { RunOnEventNodeData } from "../types";
import { EventMessage } from "./EventMessage";
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

export const RunOnEventNode = ({ id, data }: NodeProps<RunOnEventNodeData>) => {
  const reactflowEdges = useEdges();
  const hasTargetEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.target === id && edge.source !== "variable",
    );
  }, [reactflowEdges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.source === id && edge.target !== "output",
    );
  }, [id, reactflowEdges]);

  const {
    selectedComponentId,
    featureFlagWebhookEnabled,
    updateSelectedComponentId,
    updateEditorMultiScreenModel,
    enabledQuery,
    accessToken,
  } = useInstillStore(useShallow(selector));

  const isSelected = selectedComponentId === id;

  const definitions = useComponentDefinitions({
    componentType: "all",
    enabled: enabledQuery,
    accessToken,
  });

  const handleClick = React.useCallback(() => {
    updateSelectedComponentId(() => id);

    const viewId = `${id}-event-message`;

    const targetDefinition = definitions.data?.find(
      (definition) => definition.id === data.type,
    );

    if (!targetDefinition) {
      return;
    }

    const eventSpec = targetDefinition.spec.eventSpecifications?.[data.event];

    if (!eventSpec || !eventSpec.messageExamples[0]) {
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
            view: (
              <EventMessage
                id={id}
                messageSnippet={JSON.stringify(
                  eventSpec.messageExamples[0],
                  null,
                  2,
                )}
                messageDataFirstDataKey={
                  eventSpec.messageExamples[0]
                    ? (Object.keys(eventSpec.messageExamples[0])[0] ?? null)
                    : null
                }
              />
            ),
            title: viewId,
            closeable: true,
          },
        ],
        currentViewId: viewId,
      },
    }));
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
      definitionId={data.type}
      definitionTitle={data.type}
      customHandleClassName="!border-[#AF89FA]"
      nodeClassName="!rounded-full"
    >
      <div
        className="absolute rounded-full top-0 left-0 p-2 bg-semantic-bg-secondary translate-x-[15%] translate-y-[15%]"
        style={{
          border: "1px solid #AF89FA",
        }}
      >
        <Icons.Lightning02 className="w-6 h-6 stroke-semantic-secondary-hover" />
      </div>
    </NodeBase>
  ) : null;
};
