import { FC } from "react";
import cn from "clsx";
import { Nullable } from "@/types/general";

export type TableProps = {
  /** TailwindCSS class
   * - Utilities for controlling whether table borders should collapse or be separated.
   * - e.g. border-collapse | border-separate
   * - https://tailwindcss.com/docs/border-collapse
   */
  borderCollapse: Nullable<string>;

  /** TailwindCSS class
   * - Utilities for controlling the table layout algorithm.
   * - e.g. table-auto | table-fixed
   * - https://tailwindcss.com/docs/table-layout
   */
  tableLayout: Nullable<string>;

  /** TailwindCSS class
   * - e.g. mb-10
   */
  marginBottom: Nullable<string>;
};

const TableContainer: FC<TableProps> = ({
  children,
  tableLayout,
  borderCollapse,
  marginBottom,
}) => {
  return (
    <table className={cn("w-full", borderCollapse, tableLayout, marginBottom)}>
      {children}
    </table>
  );
};

export default TableContainer;
