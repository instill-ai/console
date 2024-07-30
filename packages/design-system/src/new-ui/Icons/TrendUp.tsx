"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const TrendUp = React.forwardRef<
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
      <path d="M14.6666 4.66675L9.42083 9.9125C9.15682 10.1765 9.02482 10.3085 8.8726 10.358C8.7387 10.4015 8.59447 10.4015 8.46057 10.358C8.30836 10.3085 8.17635 10.1765 7.91234 9.9125L6.0875 8.08766C5.82349 7.82365 5.69148 7.69164 5.53926 7.64219C5.40537 7.59868 5.26114 7.59868 5.12724 7.64219C4.97502 7.69164 4.84302 7.82365 4.579 8.08766L1.33325 11.3334M14.6666 4.66675H9.99992M14.6666 4.66675V9.33341" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
});
TrendUp.displayName = "IconTrendUp";
