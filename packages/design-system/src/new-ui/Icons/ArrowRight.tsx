import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowRight = React.forwardRef<
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
        d="M5 12H19M19 12L12 5M19 12L12 19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowRight.displayName = "IconArrowRight";
