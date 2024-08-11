"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const PPTXFile = React.forwardRef<
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
        d="M10.499 32H9.13099V25.718H12.101C13.271 25.718 14.009 26.537 14.009 27.725C14.009 28.913 13.271 29.732 12.101 29.732H10.499V32ZM10.499 26.906V28.544H11.939C12.344 28.544 12.596 28.328 12.596 27.923V27.527C12.596 27.122 12.344 26.906 11.939 26.906H10.499ZM16.4052 32H15.0372V25.718H18.0072C19.1772 25.718 19.9152 26.537 19.9152 27.725C19.9152 28.913 19.1772 29.732 18.0072 29.732H16.4052V32ZM16.4052 26.906V28.544H17.8452C18.2502 28.544 18.5022 28.328 18.5022 27.923V27.527C18.5022 27.122 18.2502 26.906 17.8452 26.906H16.4052ZM25.2635 26.933H23.5625V32H22.1945V26.933H20.4935V25.718H25.2635V26.933ZM25.6503 32L27.6663 28.751L25.7493 25.718H27.3423L28.5663 27.842H28.5933L29.8353 25.718H31.3113L29.3763 28.778L31.4193 32H29.8353L28.4763 29.687H28.4493L27.1263 32H25.6503Z"
        fill="white"
      />
    </IconBase>
  );
});
PPTXFile.displayName = "IconPPTXFile";
