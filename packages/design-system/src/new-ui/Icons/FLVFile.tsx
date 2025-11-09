"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const FLVFile = React.forwardRef<
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
        fill="#1D2433"
      />
      <path
        opacity="0.3"
        d="M24.2666 0L36.3999 12.1216H28.2666C26.0575 12.1216 24.2666 10.3308 24.2666 8.12162V0Z"
        fill="white"
      />
      <path
        d="M15.9804 28.1111H15.9534L15.4944 29.0291L14.2704 31.2521L13.0734 29.0381L12.5964 28.0481H12.5694V32.2331H11.2824V25.9511H12.7314L14.2704 28.8941H14.2884L15.8094 25.9511H17.2674V32.2331H15.9804V28.1111ZM20.8434 29.4971L20.0244 30.4871V32.2331H18.6564V25.9511H20.0244V28.9391H20.0784L20.9694 27.7241L22.3824 25.9511H23.9304L21.8154 28.5341L24.1194 32.2331H22.5084L20.8434 29.4971ZM26.1525 32.2331L24.1275 25.9511H25.5135L26.4495 28.9661L26.9445 30.9371H26.9715L27.4485 28.9661L28.3845 25.9511H29.7255L27.6825 32.2331H26.1525Z"
        fill="white"
      />
    </IconBase>
  );
});
FLVFile.displayName = "IconFLVFile";
