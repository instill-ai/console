import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const VisualQuestionAnswering = React.forwardRef<
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
        d="M17.8543 16.0679C16.182 17.6095 13.8875 19 11.0513 19C5.94625 19 2.59638 14.4952 1.47097 12.7132C1.33479 12.4975 1.26669 12.3897 1.22857 12.2234C1.19994 12.0985 1.19994 11.9015 1.22857 11.7766C1.26669 11.6103 1.33479 11.5025 1.47097 11.2868C2.59638 9.50484 5.94625 5 11.0513 5C14.2244 5 16.7194 6.74045 18.4236 8.48566M18.4237 12.368C18.5998 11.8671 18.9476 11.4447 19.4054 11.1757C19.8631 10.9067 20.4013 10.8083 20.9247 10.8981C21.448 10.9879 21.9227 11.2599 22.2646 11.6661C22.6065 12.0723 22.7937 12.5864 22.7929 13.1174C22.7929 14.6163 20.5446 15.3657 20.5446 15.3657M20.5737 18.3657H20.5837M14.0513 12C14.0513 13.6569 12.7081 15 11.0513 15C9.3944 15 8.05125 13.6569 8.05125 12C8.05125 10.3431 9.3944 9 11.0513 9C12.7081 9 14.0513 10.3431 14.0513 12Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
VisualQuestionAnswering.displayName = "IconVisualQuestionAnswering";
