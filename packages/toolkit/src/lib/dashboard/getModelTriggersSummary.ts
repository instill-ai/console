import {
  ModelTriggerCountRecord,
  ModelTriggersStatusSummary,
} from "instill-sdk";

export function getModelTriggersSummary(
  modelTriggerCounts: ModelTriggerCountRecord[],
): ModelTriggersStatusSummary {
  const completedModel = modelTriggerCounts.find(
    (r) => r.status === "STATUS_COMPLETED",
  );

  const erroredModel = modelTriggerCounts.find(
    (r) => r.status === "STATUS_ERRORED",
  );

  return {
    completed: {
      statusType: "STATUS_COMPLETED" as const,
      type: "model" as const,
      amount: completedModel?.triggerCount || 0,
      delta: 0,
    },
    errored: {
      statusType: "STATUS_ERRORED" as const,
      type: "model" as const,
      amount: erroredModel?.triggerCount || 0,
      delta: 0,
    },
  };
}
