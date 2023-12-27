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
      <div className={cn("flex h-9 flex-row gap-x-2", width, padding)}>
        <div className="flex-1 animate-pulse bg-[#D9D9D9]" />
      </div>
    </td>
  );
};
