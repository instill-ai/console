"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "../Icons/IconBase";

export const Number = React.forwardRef<
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
        d="M19.4629 2.10357C19.958 1.85882 20.5578 2.06175 20.8025 2.55684C22.2095 5.40286 23 8.61015 23 12C23 15.3899 22.2095 18.5972 20.8025 21.4432C20.5578 21.9383 19.958 22.1412 19.4629 21.8964C18.9678 21.6517 18.7649 21.0519 19.0096 20.5568C20.2833 17.9805 21 15.0759 21 12C21 8.92408 20.2833 6.01947 19.0096 3.44318C18.7649 2.94809 18.9678 2.34832 19.4629 2.10357ZM4.53709 2.10357C5.03218 2.34832 5.23512 2.94809 4.99037 3.44318C3.71674 6.01947 3 8.92408 3 12C3 15.0759 3.71674 17.9805 4.99037 20.5568C5.23512 21.0519 5.03218 21.6517 4.53709 21.8964C4.042 22.1412 3.44224 21.9383 3.19749 21.4432C1.79052 18.5972 1 15.3899 1 12C1 8.61015 1.79052 5.40286 3.19749 2.55684C3.44224 2.06175 4.042 1.85882 4.53709 2.10357ZM12 7.19141C10.8954 7.19141 10 8.08685 10 9.19141V14.5247C10 15.6293 10.8954 16.5247 12 16.5247C13.1046 16.5247 14 15.6293 14 14.5247V9.19141C14 8.08685 13.1046 7.19141 12 7.19141ZM8 9.19141C8 6.98228 9.79086 5.19142 12 5.19142C14.2091 5.19142 16 6.98228 16 9.19141V14.5247C16 16.7339 14.2091 18.5247 12 18.5247C9.79086 18.5247 8 16.7339 8 14.5247V9.19141Z"
        className={fillAreaColor}
      />
    </IconBase>
  );
});
Number.displayName = "NumberIcon";
