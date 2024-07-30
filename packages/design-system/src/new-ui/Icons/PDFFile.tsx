"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const PDFFile = React.forwardRef<
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
      <path d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z" fill="#E02E3D" />
      <path opacity="0.3" d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" fill="white" />
      <path d="M13.3379 32H11.9699V25.718H14.9399C16.1099 25.718 16.8479 26.537 16.8479 27.725C16.8479 28.913 16.1099 29.732 14.9399 29.732H13.3379V32ZM13.3379 26.906V28.544H14.7779C15.1829 28.544 15.4349 28.328 15.4349 27.923V27.527C15.4349 27.122 15.1829 26.906 14.7779 26.906H13.3379ZM17.8761 32V25.718H20.2431C21.9081 25.718 23.0061 26.771 23.0061 28.859C23.0061 30.947 21.9081 32 20.2431 32H17.8761ZM19.2441 30.785H20.2431C21.0531 30.785 21.5571 30.344 21.5571 29.345V28.373C21.5571 27.374 21.0531 26.933 20.2431 26.933H19.2441V30.785ZM25.5195 32H24.1515V25.718H28.3185V26.933H25.5195V28.22H27.9045V29.426H25.5195V32Z" fill="white" />
    </IconBase>
  );
});
PDFFile.displayName = "IconPDFFile";
