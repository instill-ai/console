import {
  PipelineComponent,
  PipelineGeneralComponent,
  PipelineIteratorComponent,
} from "instill-sdk";

function isPipelineGeneralComponent(
  component: PipelineComponent,
): component is PipelineGeneralComponent {
  return component.type !== "iterator";
}

function isPipelineIteratorComponent(
  component: PipelineComponent,
): component is PipelineIteratorComponent {
  return component.type === "iterator";
}

export const checkComponentTypeHelper = {
  isPipelineGeneralComponent,
  isPipelineIteratorComponent,
};
