import { PipelineGeneralComponent } from "../../../lib";

export const getGeneralComponentConfiguration = (
  component: PipelineGeneralComponent
) => {
  return {
    input: component.input,
    task: component.task,
    condition: component.condition,
    connection: component.connection ? component.connection : undefined,
  };
};
