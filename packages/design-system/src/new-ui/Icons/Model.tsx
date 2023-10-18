import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Model = React.forwardRef<
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
      <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2" />
      <line x1="15" y1="3" x2="15" y2="21" strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
      <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2" />
      <path
        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Model.displayName = "IconModel";
