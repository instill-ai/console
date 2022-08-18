import { ReactNode } from "react";

export type TableBodyProps = {
  children: ReactNode;
};

const TableBody = ({ children }: TableBodyProps) => {
  return <tbody>{children}</tbody>;
};

export default TableBody;
