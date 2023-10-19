import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ChevronSelectorVertical = React.forwardRef<
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
        d="M7 15L12 20L17 15M7 9L12 4L17 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ChevronSelectorVertical.displayName = "IconChevronSelectorVertical";
