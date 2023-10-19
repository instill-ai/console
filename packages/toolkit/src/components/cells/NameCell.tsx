import cn from "clsx";
import Link from "next/link";
import type { Nullable, ResourceState } from "../../lib";

import { StateIcon } from "../StateIcon";

export type NameCellProps = {
  state: ResourceState;
  width: Nullable<string>;
  name: string;
  link: string;
  padding: string;
};

export const NameCell = ({
  state,
  width,
  name,
  link,
  padding,
}: NameCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        <div className="flex min-h-8 min-w-8">
          <StateIcon
            state={state}
            width="w-[18px]"
            height="h-[18px]"
            position="m-auto"
          />
        </div>
        <Link className="w-4/5" href={link}>
          <h3 className="text-instill-h3 hover:underline truncate">{name}</h3>
        </Link>
      </div>
    </td>
  );
};
