"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowDown = React.forwardRef<
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
        d="M12 5V19M12 19L19 12M12 19L5 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowDown.displayName = "IconArrowDown";
