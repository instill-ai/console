import { ReactNode } from "react";

export type TableBodyProps = {
  children: ReactNode;
};

export const TableBody = ({ children }: TableBodyProps) => {
  return <tbody>{children}</tbody>;
};
