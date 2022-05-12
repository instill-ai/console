import { FC } from "react";
import cn from "clsx";
import Link from "next/link";

export type CellBaseProps = {
  paddingTop: string;
  paddingLeft: string;
  paddingRight: string;
  paddingBottom: string;
  link?: string;
};

const CellBase: FC<CellBaseProps> = ({
  children,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  link,
}) => {
  return (
    <>
      {link ? (
        <Link href={link}>
          <td
            className={cn(
              paddingTop,
              paddingBottom,
              paddingLeft,
              paddingRight,
              link ? "cursor-pointer" : "cursor-auto"
            )}
          >
            {children}
          </td>
        </Link>
      ) : (
        <td
          className={cn(paddingTop, paddingBottom, paddingLeft, paddingRight)}
        >
          {children}
        </td>
      )}
    </>
  );
};

export default CellBase;
