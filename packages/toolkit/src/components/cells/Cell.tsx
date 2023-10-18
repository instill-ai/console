import cn from "clsx";
import { Nullable } from "../../lib";

export type CellProps = {
  width: Nullable<string>;
  padding: string;
  children: React.ReactNode;
};

export const Cell = ({ width, children, padding }: CellProps) => {
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        {children}
      </div>
    </td>
  );
};
