"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const BracketSlash = React.forwardRef<
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
        d="M19.0535 20C20.3155 20 21.3395 18.977 21.3395 17.714V13.143L22.4825 12L21.3395 10.857V6.286C21.3395 5.023 20.3165 4 19.0535 4M5.91167 4C4.64867 4 3.62567 5.023 3.62567 6.286V10.857L2.48267 12L3.62567 13.143V17.714C3.62567 18.977 4.64867 20 5.91167 20M9.48267 17L15.4827 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
BracketSlash.displayName = "IconBracketSlash";
