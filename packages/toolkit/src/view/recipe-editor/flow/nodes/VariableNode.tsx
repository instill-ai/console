import { NodeProps } from "reactflow";

import { TriggerNodeData } from "../../../pipeline-builder";

export const VariableNode = ({ data, id }: NodeProps<TriggerNodeData>) => {
  console.log(data, id);
  return <div />;
};
