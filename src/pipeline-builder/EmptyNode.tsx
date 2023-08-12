import { NodeProps } from "reactflow";
import { NodeData } from "./type";

export const EmptyNode = ({ data, id }: NodeProps<NodeData>) => {
  return <div></div>;
};
