"use client";

import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const Doc = React.forwardRef<
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.28899 3.59961H13.1779C13.3606 3.59961 13.5358 3.66809 13.665 3.78999L17.7983 7.68999C17.9275 7.81189 18.0001 7.97722 18.0001 8.14961V19.7496C18.0001 20.1086 17.6917 20.3996 17.3112 20.3996H6.28899C5.90852 20.3996 5.6001 20.1086 5.6001 19.7496V4.24961C5.6001 3.89062 5.90852 3.59961 6.28899 3.59961ZM6.97788 4.89961V19.0996H16.6223V8.41885L12.8925 4.89961H6.97788Z"
        className={fillAreaColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 15.5H10V14H19V15.5Z"
        className={fillAreaColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 18.5H10V17H17.5V18.5Z"
        className={fillAreaColor}
      />
    </ComplicateIconBase>
  );
});
Doc.displayName = "DocIcon";
