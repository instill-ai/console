"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const Cohere = React.forwardRef<
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
        d="M20.0258 35.4063C21.551 35.4063 24.585 35.3227 28.7788 33.596C33.6658 31.5839 43.3887 27.9314 50.4027 24.1797C55.308 21.5556 57.4584 18.0851 57.4584 13.4115C57.4584 6.92504 52.2 1.66667 45.7137 1.66667H18.5365C9.21955 1.66667 1.66669 9.21954 1.66669 18.5365C1.66669 27.8535 8.73839 35.4063 20.0258 35.4063Z"
        fill="#39594D"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.6224 47.0233C24.6224 42.4563 27.3719 38.3387 31.59 36.588L40.1487 33.036C48.8057 29.4431 58.3344 35.805 58.3344 45.1783C58.3344 52.44 52.4464 58.3263 45.1844 58.3243L35.918 58.322C29.6791 58.3203 24.6224 53.2623 24.6224 47.0233Z"
        fill="#D18EE2"
      />
      <path
        d="M11.3917 37.6303C6.02079 37.6303 1.66669 41.984 1.66669 47.355V48.6147C1.66669 53.9853 6.02062 58.3393 11.3915 58.3393C16.7624 58.3393 21.1165 53.9853 21.1165 48.6147V47.355C21.1165 41.984 16.7625 37.6303 11.3917 37.6303Z"
        fill="#FF7759"
      />
    </LogoBase>
  );
});
Cohere.displayName = "Cohere";
