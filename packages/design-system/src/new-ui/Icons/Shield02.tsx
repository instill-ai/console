"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Shield02 = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M11.302 21.6149C11.5234 21.744 11.6341 21.8086 11.7903 21.8421C11.9116 21.8681 12.0884 21.8681 12.2097 21.8421C12.3659 21.8086 12.4766 21.744 12.698 21.6149C14.646 20.4784 20 16.9084 20 12V8.20001C20 7.12611 20 6.58916 19.8345 6.20801C19.6662 5.82061 19.4986 5.61452 19.1536 5.37091C18.8141 5.13123 18.1486 4.99283 16.8177 4.71603C15.3508 4.41094 14.2243 3.86004 13.1944 3.06333C12.7005 2.68127 12.4536 2.49025 12.2603 2.43814C12.0564 2.38317 11.9436 2.38317 11.7397 2.43814C11.5464 2.49025 11.2995 2.68127 10.8056 3.06333C9.77572 3.86004 8.6492 4.41094 7.1823 4.71603C5.85137 4.99283 5.18591 5.13123 4.84645 5.37091C4.50142 5.61452 4.33379 5.82061 4.16554 6.20801C4 6.58916 4 7.12611 4 8.2V12C4 16.9084 9.35396 20.4784 11.302 21.6149Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Shield02.displayName = "IconShield02";
