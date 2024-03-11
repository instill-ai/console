"use client";

import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const Drag = React.forwardRef<
  SVGSVGElement,
  Omit<ComplicateIconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, ...passThrough } = props;
  return (
    <ComplicateIconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 30 30"
      className={className}
    >
      <path
        className={fillAreaColor}
        d="M8.99976 4.00026C7.89519 4.00026 6.99976 4.89569 6.99976 6.00026C6.99976 7.10483 7.89519 8.00026 8.99976 8.00026C10.1043 8.00026 10.9998 7.10483 10.9998 6.00026C10.9998 4.89569 10.1043 4.00026 8.99976 4.00026Z"
      />
      <path
        className={fillAreaColor}
        d="M14.9998 4.00038C13.8952 4.00038 12.9998 4.89581 12.9998 6.00038C12.9998 7.10495 13.8952 8.00038 14.9998 8.00038C16.1043 8.00038 16.9998 7.10495 16.9998 6.00038C16.9998 4.89581 16.1043 4.00038 14.9998 4.00038Z"
      />
      <path
        className={fillAreaColor}
        d="M8.99976 10.0004C7.89519 10.0004 6.99976 10.8958 6.99976 12.0004C6.99976 13.105 7.89519 14.0004 8.99976 14.0004C10.1043 14.0004 10.9998 13.105 10.9998 12.0004C10.9998 10.8958 10.1043 10.0004 8.99976 10.0004Z"
      />
      <path
        className={fillAreaColor}
        d="M14.9998 10.0004C13.8952 10.0004 12.9998 10.8958 12.9998 12.0004C12.9998 13.105 13.8952 14.0004 14.9998 14.0004C16.1043 14.0004 16.9998 13.105 16.9998 12.0004C16.9998 10.8958 16.1043 10.0004 14.9998 10.0004Z"
      />
      <path
        className={fillAreaColor}
        d="M8.99976 16.0004C7.89519 16.0004 6.99976 16.8958 6.99976 18.0004C6.99976 19.105 7.89519 20.0004 8.99976 20.0004C10.1043 20.0004 10.9998 19.105 10.9998 18.0004C10.9998 16.8958 10.1043 16.0004 8.99976 16.0004Z"
      />
      <path
        className={fillAreaColor}
        d="M14.9998 16.0004C13.8952 16.0004 12.9998 16.8958 12.9998 18.0004C12.9998 19.105 13.8952 20.0004 14.9998 20.0004C16.1043 20.0004 16.9998 19.105 16.9998 18.0004C16.9998 16.8958 16.1043 16.0004 14.9998 16.0004Z"
      />
    </ComplicateIconBase>
  );
});

Drag.displayName = "DragIcon";
