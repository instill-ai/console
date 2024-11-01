import { ModelTriggersStatusSummary, ModelTriggerTableRecord } from "instill-sdk";
import { calculatePercentageDelta } from "./calculatePercentageDelta";

export function getModelTriggersSummary(
    models: ModelTriggerTableRecord[],
    modelsPrevious: ModelTriggerTableRecord[],
): ModelTriggersStatusSummary {
    let modelCompleteAmount = 0;
    let modelCompleteAmountPrevious = 0;
    let modelErroredAmount = 0;
    let modelErroredAmountPrevious = 0;

    models.forEach((model) => {
        modelCompleteAmount += Number(model.triggerCountCompleted);
        modelErroredAmount += Number(model.triggerCountErrored);
    });

    modelsPrevious.forEach((model) => {
        modelCompleteAmountPrevious += Number(model.triggerCountCompleted);
        modelErroredAmountPrevious += Number(model.triggerCountErrored);
    });

    return {
        completed: {
            statusType: "STATUS_COMPLETED",
            amount: modelCompleteAmount,
            type: "model",
            delta: calculatePercentageDelta(
                modelCompleteAmountPrevious,
                modelCompleteAmount,
            ),
        },
        errored: {
            statusType: "STATUS_ERRORED",
            amount: modelErroredAmount,
            type: "model",
            delta: calculatePercentageDelta(
                modelErroredAmountPrevious,
                modelErroredAmount,
            ),
        },
    };
}