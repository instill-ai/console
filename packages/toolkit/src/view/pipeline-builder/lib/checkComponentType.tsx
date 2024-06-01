import {
  PipelineComponent,
  PipelineGeneralComponent,
  PipelineIteratorComponent,
} from "../../../lib";

export function isPipelineGeneralComponent(
  component: PipelineComponent
): component is PipelineGeneralComponent {
  return component.type !== "iterator";
}

export function isPipelineIteratorComponent(
  component: PipelineComponent
): component is PipelineIteratorComponent {
  return component.type === "iterator";
}
