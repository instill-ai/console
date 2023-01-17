import { ReactNode } from "react";
import { Nullable } from "@/types/general";

export type CellBaseProps = {
  padding: Nullable<string>;
  children?: ReactNode;
};

export const CellBase = ({ children, padding }: CellBaseProps) => {
  return <td className={padding ? padding : undefined}>{children}</td>;
};
