import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const MultipleVideo = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 25 24"
      className={className}
    >
      <g clip-path="url(#clip0_1497_93)">
        <path
          d="M16.943 4.80003L12.943 8.00003L8.94304 4.80003M20.943 12.5093V11.84C20.943 10.4959 20.943 9.82384 20.6815 9.31045C20.4514 8.85886 20.0842 8.49171 19.6326 8.26161C19.1192 8.00003 18.4472 8.00003 17.103 8.00003H8.78304C7.43891 8.00003 6.76685 8.00003 6.25346 8.26161C5.80187 8.49171 5.43472 8.85886 5.20462 9.31045C4.94304 9.82384 4.94304 10.4959 4.94304 11.84V15.36C4.94304 16.7042 4.94304 17.3762 5.20462 17.8896C5.43472 18.3412 5.80187 18.7083 6.25346 18.9384C6.76685 19.2 7.43891 19.2 8.78304 19.2H14.1772M20.943 22.2001V19.2001M20.943 19.2001V16.2001M20.943 19.2001H17.943M20.943 19.2001H23.943"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1497_93">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.943039)"
          />
        </clipPath>
      </defs>
    </IconBase>
  );
});
MultipleVideo.displayName = "IconMultipleVideo";
