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
      viewBox="0 0 41 41"
      className={className}
    >
      <path
        d="M4.04443 4C4.04443 1.79086 5.83529 0 8.04443 0H24.2667L36.4 12.1216V36.4054C36.4 38.6145 34.6091 40.4054 32.4 40.4054H8.04443C5.8353 40.4054 4.04443 38.6145 4.04443 36.4054V4Z"
        fill="#8B55F7"
      />
      <path
        opacity="0.3"
        d="M24.2666 0L36.3999 12.1216H28.2666C26.0575 12.1216 24.2666 10.3308 24.2666 8.12162V0Z"
        fill="white"
      />
      <path
        d="M12.5171 27.1661V32.2331H11.1491V27.1661H9.44812V25.9511H14.2181V27.1661H12.5171ZM15.154 32.2331V25.9511H19.429V27.1661H16.522V28.4531H19.015V29.6591H16.522V31.0181H19.429V32.2331H15.154ZM25.8408 32.2331H24.2568L22.8978 29.9201H22.8708L21.5478 32.2331H20.0718L22.0878 28.9841L20.1708 25.9511H21.7638L22.9878 28.0751H23.0148L24.2568 25.9511H25.7328L23.7978 29.0111L25.8408 32.2331ZM29.2954 27.1661V32.2331H27.9274V27.1661H26.2264V25.9511H30.9964V27.1661H29.2954Z"
        fill="white"
      />
    </IconBase>
  );
});
TXTFile.displayName = "IconTXTFile";
