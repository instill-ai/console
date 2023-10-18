import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const VDPSquare = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 60 60"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99742 10H23.3308V30H36.6641V10H49.9974V36.6667H43.3308V43.3333H36.6641V50H23.3308V43.3333H16.6641V36.6667H9.99742V10ZM19.9974 13.3333V33.3333H13.3308V13.3333H19.9974ZM26.664 33.3334V40H19.9973V33.3334H26.664ZM33.3307 46.6666V40H39.9973V33.3334H33.3306V39.9999H26.6641V46.6666H33.3307ZM46.664 33.3333V13.3333H39.9974V33.3333H46.664Z"
        fill="#2B2B2B"
      />
      <path d="M33.332 46.6667V40H26.6654V46.6667H33.332Z" fill="#FFDF3A" />
      <path d="M26.6654 40V33.3333H19.9987V40H26.6654Z" fill="#28F77E" />
      <path d="M39.9987 40V33.3333H33.3321V40H39.9987Z" fill="#FFDF3A" />
      <path
        d="M19.9987 33.3333V13.3333H13.3321V33.3333H19.9987Z"
        fill="#F7F7F7"
      />
      <path
        d="M46.6654 33.3333V13.3333H39.9987V33.3333H46.6654Z"
        fill="#40A8F5"
      />
    </LogoBase>
  );
});
VDPSquare.displayName = "VDPSquare";
