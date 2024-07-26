"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const TXTFile = React.forwardRef<
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
        d="M0 4.88648C0 2.67734 1.79086 0.886475 4 0.886475H20L32 12.8865V36.8865C32 39.0956 30.2091 40.8865 28 40.8865H4C1.79086 40.8865 0 39.0956 0 36.8865V4.88648Z"
        fill="#1D2433"
      />
      <path
        opacity="0.3"
        d="M20 0.886475L32 12.8865H24C21.7909 12.8865 20 11.0956 20 8.88647V0.886475Z"
        fill="white"
      />
    </IconBase>
  );
});
TXTFile.displayName = "IconTXTFile";
