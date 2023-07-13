import { Nullable, ResourceState, StateIcon } from "@instill-ai/toolkit";
import { Badge } from "../badge/Badge";

export type StateCellProps = {
  state: string;
  width: Nullable<string>;
  name: string | number;
  padding: string;
};

export const StateCell = ({ state, width, name, padding }: StateCellProps) => {
  return (
    <td>
      <Badge statusname={state} className="border-0" />
    </td>
  );
};
