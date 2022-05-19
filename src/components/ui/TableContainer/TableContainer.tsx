import { FC } from "react";
import cn from "clsx";

export type TableProps = {
  /** TailwindCSS class
   * - Utilities for controlling whether table borders should collapse or be separated.
   * - e.g. border-collapse | border-separate
   * - https://tailwindcss.com/docs/border-collapse
   */
  borderCollapse: string;

  /** TailwindCSS class
   * - Utilities for controlling the table layout algorithm.
   * - e.g. table-auto | table-fixed
   * - https://tailwindcss.com/docs/table-layout
   */
  tableLayout: string;
};

const TableContainer: FC<TableProps> = ({
  children,
  tableLayout,
  borderCollapse,
}) => {
  return (
    <table className={cn("w-full", borderCollapse, tableLayout)}>
      {children}
    </table>
  );
};

export default TableContainer;
