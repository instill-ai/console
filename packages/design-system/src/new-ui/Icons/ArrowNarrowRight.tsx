import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowNarrowRight = React.forwardRef<
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
        d="M4 12H20M20 12L14 6M20 12L14 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowNarrowRight.displayName = "IconArrowNarrowRight";
