import {
  PipelineConnectorComponent,
  PipelineOperatorComponent,
} from "../../../lib";

export const getConnectorOperatorComponentConfiguration = (
  component: PipelineConnectorComponent | PipelineOperatorComponent
) => {
  if ("connector_component" in component) {
    return {
      input: component.connector_component.input,
      task: component.connector_component.task,
      condition: component.connector_component.condition,
    };
  } else {
    return {
      input: component.operator_component.input,
      task: component.operator_component.task,
      condition: component.operator_component.condition,
    };
  }
};
