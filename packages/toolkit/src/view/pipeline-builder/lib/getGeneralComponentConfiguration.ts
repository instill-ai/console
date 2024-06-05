import { PipelineGeneralComponent } from "../../../lib";

export const getGeneralComponentConfiguration = (
  component: PipelineGeneralComponent
) => {
  return {
    input: component.input,
    task: component.task,
    condition: component.condition,
    setup: component.setup ? component.setup : undefined,
  };
};
