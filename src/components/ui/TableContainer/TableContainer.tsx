import { FC } from "react";
import cn from "clsx";

export type TableProps = {
  /** TailwindCSS class
   * - Utilities for controlling whether table borders should collapse or be separated.
   * - e.g. border-collapse | border-separate
   * - https://tailwindcss.com/docs/border-collapse
   */
  borderCollapse: string;
};

const TableContainer: FC<TableProps> = ({ children, borderCollapse }) => {
  return <table className={cn("w-full", borderCollapse)}>{children}</table>;
};

export default TableContainer;
