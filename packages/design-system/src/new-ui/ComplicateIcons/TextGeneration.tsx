"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "../Icons/IconBase";

export const TextGeneration = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 30 30"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.75 4H19.25C19.4489 4 19.6397 4.07902 19.7803 4.21967L24.2803 8.71967C24.421 8.86032 24.5 9.05109 24.5 9.25V21.25C24.5 21.6642 24.1642 22 23.75 22H18.5V25.75C18.5 26.1642 18.1642 26.5 17.75 26.5H5.75C5.33579 26.5 5 26.1642 5 25.75V9.25C5 8.83579 5.33579 8.5 5.75 8.5H11V4.75C11 4.33579 11.3358 4 11.75 4ZM11.75 22H17V25H6.5V10H11V21.25C11 21.6642 11.3358 22 11.75 22ZM23 20.5H17.75H12.5V9.25V5.5H18.9393L23 9.56066V20.5ZM10.5 13.5H7V12.5H10.5V13.5ZM10.5 15.5H7V14.5H10.5V15.5ZM7 17.5H10.5V16.5H7V17.5ZM10.5 19.5H7V18.5H10.5V19.5ZM7 21.5H10.5V20.5H7V21.5ZM16 23.5H7V22.5H16V23.5ZM15.1382 11.8051C15.0131 11.9302 14.8437 12.0005 14.6668 12.0005C14.49 12.0005 14.3206 11.9302 14.1954 11.8051C14.0703 11.6799 14 11.5105 14 11.3337V10.6668C14 10.49 14.0703 10.3206 14.1954 10.1954C14.3206 10.0703 14.49 10 14.6668 10H21.3332C21.51 10 21.6794 10.0703 21.8046 10.1954C21.9297 10.3206 22 10.49 22 10.6668V11.3337C22 11.5719 21.8729 11.7919 21.6666 11.9111C21.4603 12.0302 21.2063 12.0302 21 11.9111C20.7938 11.7919 20.6666 11.5719 20.6666 11.3337H18.6667V16.6666H19.3335C19.5718 16.6666 19.7918 16.7938 19.9109 17C20.0301 17.2063 20.0301 17.4603 19.9109 17.6666C19.7918 17.8729 19.5718 18 19.3335 18H16.6668C16.4285 18 16.2085 17.8729 16.0894 17.6666C15.9702 17.4603 15.9702 17.206 16.0894 17C16.2085 16.794 16.4285 16.6669 16.6668 16.6669H17.3336V11.3337H15.3337C15.3337 11.5105 15.2634 11.6799 15.1382 11.8051Z"
        className={fillAreaColor}
      />
    </IconBase>
  );
});
TextGeneration.displayName = "TextGenerationIcon";
