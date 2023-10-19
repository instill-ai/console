import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const ImageToText = React.forwardRef<
  SVGSVGElement,
  Omit<ComplicateIconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, ...passThrough } = props;
  return (
    <ComplicateIconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 30 30"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.75 4H19.25C19.4489 4 19.6397 4.07902 19.7803 4.21967L24.2803 8.71967C24.421 8.86032 24.5 9.05109 24.5 9.25V21.25C24.5 21.6642 24.1642 22 23.75 22H18.5V25.75C18.5 26.1642 18.1642 26.5 17.75 26.5H5.75C5.33579 26.5 5 26.1642 5 25.75V9.25C5 8.83579 5.33579 8.5 5.75 8.5H11V4.75C11 4.33579 11.3358 4 11.75 4ZM12.5 9.25V20.5H17.75H23V9.56066L18.9393 5.5H12.5V9.25ZM11 10H6.5V25H17V22H11.75C11.3358 22 11 21.6642 11 21.25V21.1784L7.51506 21.1782C7.34409 21.1782 7.18487 21.0934 7.08848 20.9519C6.99295 20.8104 6.97329 20.6309 7.03676 20.4721L9.09637 15.3233C9.17181 15.1352 9.35069 15.0087 9.55287 15.0002C9.76745 14.9952 9.94483 15.1032 10.035 15.2842L11 17.2143V10ZM11 19.1045L10.9873 19.1013C10.8445 19.0637 10.7246 18.9658 10.6588 18.8342L9.62699 16.7703L8.27524 20.1485L11 20.1485V19.1045ZM14.6668 12.0005C14.8437 12.0005 15.0131 11.9302 15.1382 11.8051C15.2634 11.6799 15.3337 11.5105 15.3337 11.3337H17.3336V16.6669H16.6668C16.4285 16.6669 16.2085 16.794 16.0894 17C15.9702 17.206 15.9702 17.4603 16.0894 17.6666C16.2085 17.8729 16.4285 18 16.6668 18H19.3335C19.5718 18 19.7918 17.8729 19.9109 17.6666C20.0301 17.4603 20.0301 17.2063 19.9109 17C19.7918 16.7938 19.5718 16.6666 19.3335 16.6666H18.6667V11.3337H20.6666C20.6666 11.5719 20.7938 11.7919 21 11.9111C21.2063 12.0302 21.4603 12.0302 21.6666 11.9111C21.8729 11.7919 22 11.5719 22 11.3337V10.6668C22 10.49 21.9297 10.3206 21.8046 10.1954C21.6794 10.0703 21.51 10 21.3332 10H14.6668C14.49 10 14.3206 10.0703 14.1954 10.1954C14.0703 10.3206 14 10.49 14 10.6668V11.3337C14 11.5105 14.0703 11.6799 14.1954 11.8051C14.3206 11.9302 14.49 12.0005 14.6668 12.0005Z"
        className={fillAreaColor}
      />
    </ComplicateIconBase>
  );
});
ImageToText.displayName = "ImageToTextIcon";
