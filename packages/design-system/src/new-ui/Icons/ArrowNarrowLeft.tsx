import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowNarrowLeft = React.forwardRef<
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
        d="M20 12H4M4 12L10 18M4 12L10 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowNarrowLeft.displayName = "IconArrowNarrowLeft";
