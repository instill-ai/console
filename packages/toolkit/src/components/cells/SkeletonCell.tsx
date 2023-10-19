import cn from "clsx";
import { Nullable } from "../../lib";

export type SkeletonCellProps = {
  width: Nullable<string>;
  padding: string;
};

export const SkeletonCell = (props: SkeletonCellProps) => {
  const { width, padding } = props;
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2 h-9", width, padding)}>
        <div className="flex-1 bg-[#D9D9D9] animate-pulse" />
      </div>
    </td>
  );
};
