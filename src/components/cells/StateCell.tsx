import { getColor } from "@/lib/dashboard";
import { Tag } from "@instill-ai/design-system";
import { Nullable, ResourceState, StateIcon } from "@instill-ai/toolkit";
import cn from "clsx";

export type StateCellProps = {
  state: ResourceState;
  width: Nullable<string>;
  name: string | number;
  padding: string;
};

export const StateCell = ({ state, width, name, padding }: StateCellProps) => {
  const badgeColor = getColor(state);
  return (
    <td>
      <Tag variant={badgeColor.variant} size={"sm"}>
        {badgeColor.label}
      </Tag>
    </td>
  );
};
