"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const Pinecode = React.forwardRef<
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
        d="M33.5055 16.3188L34.52 10.6812"
        stroke="#201D1E"
        strokeWidth="2.56522"
        strokeLinecap="square"
      />
      <path
        d="M38.1722 14.3188L34.6359 10L29.8243 12.8116"
        stroke="#201D1E"
        strokeWidth="2.56522"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M29.2736 40.3768L30.2591 34.7391"
        stroke="#201D1E"
        strokeWidth="2.56522"
        strokeLinecap="square"
      />
      <path
        d="M33.9403 38.3623L30.3751 34.058L25.578 36.8841"
        stroke="#201D1E"
        strokeWidth="2.56522"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M31.3171 28.7536L32.3026 23.1159"
        stroke="#201D1E"
        strokeWidth="2.56522"
        strokeLinecap="square"
      />
      <path
        d="M35.9838 26.7391L32.4331 22.4493L27.636 25.2609"
        stroke="#201D1E"
        strokeWidth="2.56522"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M27.9837 50C29.2884 50 30.3461 48.9424 30.3461 47.6377C30.3461 46.333 29.2884 45.2754 27.9837 45.2754C26.6791 45.2754 25.6214 46.333 25.6214 47.6377C25.6214 48.9424 26.6791 50 27.9837 50Z"
        fill="#201D1E"
      />
      <path
        d="M21.2881 39.884L16.9548 42.8985"
        stroke="#201D1E"
        strokeWidth="2.43478"
        strokeLinecap="square"
      />
      <path
        d="M21.549 44.7681L16.433 43.2609L16.8099 37.942"
        stroke="#201D1E"
        strokeWidth="2.43478"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M37.0272 42.7101L40.0417 47.058"
        stroke="#201D1E"
        strokeWidth="2.43478"
        strokeLinecap="square"
      />
      <path
        d="M35.0852 47.2029L40.404 47.5652L41.9113 42.4783"
        stroke="#201D1E"
        strokeWidth="2.43478"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M41.9692 33.8841L47.2736 34.8406"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
      />
      <path
        d="M43.7953 38.5362L47.9113 34.9565L45.3171 30.1884"
        stroke="#201D1E"
        stroke-idth="2.49275"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M40.4185 23.3623L45.1431 20.7536"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
      />
      <path
        d="M40.6794 18.3623L45.7084 20.4493L44.7664 25.7971"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M19.578 29.942L14.2592 29.0145"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
      />
      <path
        d="M16.2591 33.6812L13.6215 28.9131L17.6939 25.3188"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M24.6215 20.5652L21.0707 16.5072"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
      />
      <path
        d="M26.0852 15.7971L20.6504 16.029L19.6939 21.3768"
        stroke="#201D1E"
        strokeWidth="2.49275"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </LogoBase>
  );
});
Pinecode.displayName = "Pinecode";
