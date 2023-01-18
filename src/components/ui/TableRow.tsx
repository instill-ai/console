import cn from "clsx";
import { ReactNode } from "react";

export type TableRowProps = {
  borderColor: string;
  bgColor: string;
  children: ReactNode;
};

export const TableRow = ({ children, borderColor, bgColor }: TableRowProps) => {
  return <tr className={cn("border", borderColor, bgColor)}>{children}</tr>;
};
