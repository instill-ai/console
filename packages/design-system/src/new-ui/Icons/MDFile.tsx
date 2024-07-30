"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const MDFile = React.forwardRef<
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
      <path d="M4.3335 4C4.3335 1.79086 6.12436 0 8.3335 0H24.3335L36.3335 12V36C36.3335 38.2091 34.5426 40 32.3335 40H8.3335C6.12436 40 4.3335 38.2091 4.3335 36V4Z" fill="#316FED" />
      <path opacity="0.3" d="M24.3335 0L36.3335 12H28.3335C26.1244 12 24.3335 10.2091 24.3335 8V0Z" fill="white" />
      <path d="M18.8998 32V27.878H18.8728L18.4138 28.796L17.1898 31.019L15.9928 28.805L15.5158 27.815H15.4888V32H14.2018V25.718H15.6508L17.1898 28.661H17.2078L18.7288 25.718H20.1868V32H18.8998ZM21.5758 32V25.718H23.9428C25.6078 25.718 26.7058 26.771 26.7058 28.859C26.7058 30.947 25.6078 32 23.9428 32H21.5758ZM22.9438 30.785H23.9428C24.7528 30.785 25.2568 30.344 25.2568 29.345V28.373C25.2568 27.374 24.7528 26.933 23.9428 26.933H22.9438V30.785Z" fill="white" />
    </IconBase>
  );
});
MDFile.displayName = "IconMDFile";
