"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "../Icons/IconBase";

export const ToggleLeft = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H8C5.23858 17 3 14.7614 3 12C3 9.23858 5.23858 7 8 7ZM16 5H8C4.13401 5 1 8.13401 1 12C1 15.866 4.13401 19 8 19H16C19.866 19 23 15.866 23 12C23 8.13401 19.866 5 16 5ZM7.27673 12C7.27673 11.4477 7.72445 11 8.27673 11C8.82902 11 9.27673 11.4477 9.27673 12C9.27673 12.5523 8.82902 13 8.27673 13C7.72445 13 7.27673 12.5523 7.27673 12ZM8.27673 9C6.61988 9 5.27673 10.3431 5.27673 12C5.27673 13.6569 6.61988 15 8.27673 15C9.93359 15 11.2767 13.6569 11.2767 12C11.2767 10.3431 9.93359 9 8.27673 9Z"
        className={fillAreaColor}
      />
    </IconBase>
  );
});
ToggleLeft.displayName = "ToggleLeftIcon";
