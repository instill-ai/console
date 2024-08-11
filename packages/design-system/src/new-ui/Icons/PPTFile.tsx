"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const PPTFile = React.forwardRef<
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
      <path
        d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z"
        fill="#BB2532"
      />
      <path
        opacity="0.3"
        d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z"
        fill="white"
      />
      <path
        d="M13.5268 32H12.1588V25.718H15.1288C16.2988 25.718 17.0368 26.537 17.0368 27.725C17.0368 28.913 16.2988 29.732 15.1288 29.732H13.5268V32ZM13.5268 26.906V28.544H14.9668C15.3718 28.544 15.6238 28.328 15.6238 27.923V27.527C15.6238 27.122 15.3718 26.906 14.9668 26.906H13.5268ZM19.4331 32H18.0651V25.718H21.0351C22.2051 25.718 22.9431 26.537 22.9431 27.725C22.9431 28.913 22.2051 29.732 21.0351 29.732H19.4331V32ZM19.4331 26.906V28.544H20.8731C21.2781 28.544 21.5301 28.328 21.5301 27.923V27.527C21.5301 27.122 21.2781 26.906 20.8731 26.906H19.4331ZM28.2913 26.933H26.5903V32H25.2223V26.933H23.5213V25.718H28.2913V26.933Z"
        fill="white"
      />
    </IconBase>
  );
});
PPTFile.displayName = "IconPPTFile";
