import {
  ComponentErrorUpdatedEvent,
  ComponentInputUpdatedEvent,
  ComponentOutputUpdatedEvent,
  ComponentStatusUpdatedEvent,
  PipelineErrorUpdatedEvent,
  PipelineOutputUpdatedEvent,
  PipelineStatusUpdatedEvent,
  TriggerNamespacePipelineStreamEvent,
} from "./types";

export function isPipelineStatusUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is PipelineStatusUpdatedEvent {
  return event.event === "PIPELINE_STATUS_UPDATED";
}

export function isPipelineOutputUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is PipelineOutputUpdatedEvent {
  return event.event === "PIPELINE_OUTPUT_UPDATED";
}

export function isPipelineErrorUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is PipelineErrorUpdatedEvent {
  return event.event === "PIPELINE_ERROR_UPDATED";
}

export function isComponentStatusUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is ComponentStatusUpdatedEvent {
  return event.event === "COMPONENT_STATUS_UPDATED";
}

export function isComponentInputUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is ComponentInputUpdatedEvent {
  return event.event === "COMPONENT_INPUT_UPDATED";
}

export function isComponentOutputUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is ComponentOutputUpdatedEvent {
  return event.event === "COMPONENT_OUTPUT_UPDATED";
}

export function isComponentErrorUpdatedEvent(
  event: TriggerNamespacePipelineStreamEvent,
): event is ComponentErrorUpdatedEvent {
  return event.event === "COMPONENT_ERROR_UPDATED";
}
