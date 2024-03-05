import {
  PipelineComponent,
  PipelineConnectorComponent,
  PipelineEndComponent,
  PipelineIteratorComponent,
  PipelineOperatorComponent,
  PipelineStartComponent,
} from "../../../lib";

export function isStartComponent(
  component: PipelineComponent
): component is PipelineStartComponent {
  return "start_component" in component;
}

export function isEndComponent(
  component: PipelineComponent
): component is PipelineEndComponent {
  return "end_component" in component;
}

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
