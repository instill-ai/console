import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ChevronRightDouble = React.forwardRef<
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
        d="M6 17L11 12L6 7M13 17L18 12L13 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ChevronRightDouble.displayName = "IconChevronRightDouble";
