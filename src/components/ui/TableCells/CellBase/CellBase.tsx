import { FC } from "react";
import cn from "clsx";

export type CellBaseProps = {
  paddingTop: string;
  paddingLeft: string;
  paddingRight: string;
  paddingBottom: string;
};

const CellBase: FC<CellBaseProps> = ({
  children,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
}) => {
  return (
    <td className={cn(paddingTop, paddingBottom, paddingLeft, paddingRight)}>
      {children}
    </td>
  );
};

export default CellBase;
