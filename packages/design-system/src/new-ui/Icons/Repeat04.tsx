import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Repeat04 = React.forwardRef<
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
        d="M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 9.17444 19.1213 6.67091 17 5.12537M13 22.4L11 20.4L13 18.4M12 3.49998C7.30558 3.49998 3.5 7.30555 3.5 12C3.5 14.8255 4.87867 17.329 7 18.8746M11 5.59998L13 3.59998L11 1.59998"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Repeat04.displayName = "IconRepeat04";
