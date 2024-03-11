"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const Number = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 60 60"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 47.8116V12.1884H21.8143L38.1855 28.1163V47.8115L21.8144 31.8838V47.8116H7.5ZM21.8144 31.8838L21.8143 12.1884L11.6925 22.036L21.8144 31.8838ZM38.1855 28.1163L38.1856 12.1884H52.5V47.8115H38.1855L48.3075 37.9638L38.1855 28.1163Z"
        fill="#1D2433"
      />
    </LogoBase>
  );
});
Number.displayName = "Number";
