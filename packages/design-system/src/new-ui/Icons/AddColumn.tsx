"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const AddColumn = React.forwardRef<
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
      <path
        d="M20 14V6C20 5.06812 20 4.60218 19.8478 4.23463C19.6448 3.74458 19.2554 3.35523 18.7654 3.15224C18.3978 3 17.9319 3 17 3C16.0681 3 15.6022 3 15.2346 3.15224C14.7446 3.35523 14.3552 3.74458 14.1522 4.23463C14 4.60218 14 5.06812 14 6V14M17 21V18M17 18V15M17 18H14M17 18H20M10 6V18C10 18.9319 10 19.3978 9.84776 19.7654C9.64477 20.2554 9.25542 20.6448 8.76537 20.8478C8.39782 21 7.93188 21 7 21C6.06812 21 5.60218 21 5.23463 20.8478C4.74458 20.6448 4.35523 20.2554 4.15224 19.7654C4 19.3978 4 18.9319 4 18V6C4 5.06812 4 4.60218 4.15224 4.23463C4.35523 3.74458 4.74458 3.35523 5.23463 3.15224C5.60218 3 6.06812 3 7 3C7.93188 3 8.39782 3 8.76537 3.15224C9.25542 3.35523 9.64477 3.74458 9.84776 4.23463C10 4.60218 10 5.06812 10 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
AddColumn.displayName = "IconAddColumn";
