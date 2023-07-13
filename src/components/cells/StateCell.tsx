import { Nullable, ResourceState, StateIcon } from "@instill-ai/toolkit";
import { Badge } from "../badge/Badge";
import { State } from "@/types";

export type StateCellProps = {
  state: State;
  width: Nullable<string>;
  name: string | number;
  padding: string;
};

export const StateCell = ({ state, width, name, padding }: StateCellProps) => {
  return (
    <td>
      <Badge state={state} className="border-0" />
    </td>
  );
};
