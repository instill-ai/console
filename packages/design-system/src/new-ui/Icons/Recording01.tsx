"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Recording01 = React.forwardRef<
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
        d="M3 10L3 14M7.5 6L7.5 18M12 3V21M16.5 6V18M21 10V14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Recording01.displayName = "IconRecording01";
