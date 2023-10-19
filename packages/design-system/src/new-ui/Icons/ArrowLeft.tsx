import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowLeft = React.forwardRef<
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
        d="M19 12H5M5 12L12 19M5 12L12 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowLeft.displayName = "IconArrowLeft";
