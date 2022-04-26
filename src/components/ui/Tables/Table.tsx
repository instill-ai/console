import { FC, ReactNode } from "react";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import cn from "clsx";

export type Item = {
  key: string;
  item: string[] | ReactNode[];
};

export type TableProps = {
  headItems: Item[];
  rows: {
    rowKey: string;
    items: Item[];
  }[];

  /** TailwindCSS class
   * - Utilities for controlling whether table borders should collapse or be separated.
   * - e.g. border-collapse | border-separate
   * - https://tailwindcss.com/docs/border-collapse
   */
  borderCollapse: string;
};

const Table: FC<TableProps> = ({ headItems, rows, borderCollapse }) => {
  return (
    <table className={cn("table-auto", borderCollapse)}>
      <TableHead items={headItems} />
      {rows.map((e) => (
        <TableRow key={e.rowKey} rowItems={e.items} />
      ))}
    </table>
  );
};

export default Table;
