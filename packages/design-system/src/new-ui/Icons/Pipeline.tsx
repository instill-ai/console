import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Pipeline = React.forwardRef<
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
        d="M5.94955 9.14731V15.2878C5.94955 16.4091 5.94955 16.9698 6.16981 17.3969C6.36337 17.7707 6.6704 18.0777 7.04416 18.2713C7.47133 18.4915 8.03198 18.4915 9.15329 18.4915H13.9589"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.61932 6.47753H12.9243"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.94957 9.14731C7.42405 9.14731 8.61935 7.95201 8.61935 6.47753C8.61935 5.00305 7.42405 3.80775 5.94957 3.80775C4.47509 3.80775 3.27979 5.00305 3.27979 6.47753C3.27979 7.95201 4.47509 9.14731 5.94957 9.14731Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.2985 15.8218H13.9589V21.1613H19.2985V15.8218Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.4043 6.40316L16.6286 2.62752L12.853 6.40316L16.6286 10.1788L20.4043 6.40316Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Pipeline.displayName = "IconPipeline";
