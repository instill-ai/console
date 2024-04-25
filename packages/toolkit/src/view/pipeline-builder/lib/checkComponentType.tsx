import {
  PipelineComponent,
  PipelineConnectorComponent,
  PipelineIteratorComponent,
  PipelineOperatorComponent,
} from "../../../lib";

export function isConnectorComponent(
  component: PipelineComponent
): component is PipelineConnectorComponent {
  return "connector_component" in component;
}

export function isOperatorComponent(
  component: PipelineComponent
): component is PipelineOperatorComponent {
  return "operator_component" in component;
}

export function isIteratorComponent(
  component: PipelineComponent
): component is PipelineIteratorComponent {
  return "iterator_component" in component;
}
