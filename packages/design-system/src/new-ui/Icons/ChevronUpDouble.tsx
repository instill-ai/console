import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ChevronUpDouble = React.forwardRef<
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
        d="M17 18L12 13L7 18M17 11L12 6L7 11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ChevronUpDouble.displayName = "IconChevronUpDouble";
