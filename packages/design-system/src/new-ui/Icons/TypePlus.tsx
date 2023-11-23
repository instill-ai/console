import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const TypePlus = React.forwardRef<
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
        d="M4 7.00038C4 6.0685 4 5.60256 4.15224 5.23501C4.35523 4.74496 4.74458 4.35561 5.23463 4.15262C5.60218 4.00038 6.06812 4.00038 7 4.00038H17C17.9319 4.00038 18.3978 4.00038 18.7654 4.15262C19.2554 4.35561 19.6448 4.74496 19.8478 5.23501C20 5.60256 20 6.0685 20 7.00038M8 20.0004H16M10.25 4.00038V20.0004M13.75 4.00038V20.0004M20 19.0122V16.0122M20 16.0122V13.0122M20 16.0122H17M20 16.0122H23"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
TypePlus.displayName = "IconTypePlus";
