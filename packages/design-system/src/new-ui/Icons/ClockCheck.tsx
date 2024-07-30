"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const ClockCheck = React.forwardRef<
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
      <path d="M9.66659 12.6666L10.9999 13.9999L13.9999 10.9999M14.6567 8.3665C14.6633 8.24514 14.6666 8.12292 14.6666 7.99992C14.6666 4.31802 11.6818 1.33325 7.99992 1.33325C4.31802 1.33325 1.33325 4.31802 1.33325 7.99992C1.33325 11.6235 4.22426 14.5719 7.82558 14.6644M7.99992 3.99992V7.99992L10.4922 9.24604" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
});
ClockCheck.displayName = "IconClockCheck";
