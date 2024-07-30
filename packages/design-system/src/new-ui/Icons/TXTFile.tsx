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
      viewBox="0 0 40 40"
      className={className}
    >
      <path d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z" fill="#1D2433" />
      <path opacity="0.3" d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" fill="white" />
      <path d="M16.7293 26.933H15.0283V32H13.6603V26.933H11.9593V25.718H16.7293V26.933ZM17.1162 32L19.1322 28.751L17.2152 25.718H18.8082L20.0322 27.842H20.0592L21.3012 25.718H22.7772L20.8422 28.778L22.8852 32H21.3012L19.9422 29.687H19.9152L18.5922 32H17.1162ZM28.0408 26.933H26.3398V32H24.9718V26.933H23.2708V25.718H28.0408V26.933Z" fill="white" />
    </IconBase>
  );
});
TXTFile.displayName = "IconTXTFile";
