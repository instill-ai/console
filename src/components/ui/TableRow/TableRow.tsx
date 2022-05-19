import { FC } from "react";
import cn from "clsx";

export type TableRowProps = {
  borderColor: string;
  bgColor: string;
};

const TableRow: FC<TableRowProps> = ({ children, borderColor, bgColor }) => {
  return <tr className={cn("border", borderColor, bgColor)}>{children}</tr>;
};

export default TableRow;
