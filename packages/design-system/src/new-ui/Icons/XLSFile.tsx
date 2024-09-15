"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const XLSFile = React.forwardRef<
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
      <path d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z" fill="#23956F" />
      <path opacity="0.3" d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" fill="white" />
      <path d="M11.9218 32L13.9378 28.751L12.0208 25.718H13.6138L14.8378 27.842H14.8648L16.1068 25.718H17.5828L15.6478 28.778L17.6908 32H16.1068L14.7478 29.687H14.7208L13.3978 32H11.9218ZM22.2885 32H18.5265V25.718H19.8945V30.785H22.2885V32ZM25.333 32.108C24.235 32.108 23.488 31.685 22.948 31.091L23.848 30.182C24.271 30.659 24.811 30.902 25.423 30.902C26.089 30.902 26.413 30.605 26.413 30.146C26.413 29.804 26.269 29.552 25.684 29.471L25.063 29.39C23.74 29.219 23.137 28.571 23.137 27.518C23.137 26.393 24.019 25.61 25.495 25.61C26.44 25.61 27.16 25.925 27.673 26.492L26.764 27.41C26.467 27.059 26.062 26.816 25.414 26.816C24.802 26.816 24.505 27.05 24.505 27.428C24.505 27.86 24.73 28.022 25.252 28.103L25.873 28.202C27.16 28.409 27.781 28.985 27.781 30.065C27.781 31.271 26.899 32.108 25.333 32.108Z" fill="white" />
    </IconBase>
  );
});
XLSFile.displayName = "IconXLSFile";
