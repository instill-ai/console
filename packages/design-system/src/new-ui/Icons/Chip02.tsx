"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Chip02 = React.forwardRef<
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
        d="M9 2V5M15 2V5M9 19V22M15 19V22M19 9H22M19 14H22M2 9H5M2 14H5M9.8 19H14.2C15.8802 19 16.7202 19 17.362 18.673C17.9265 18.3854 18.3854 17.9265 18.673 17.362C19 16.7202 19 15.8802 19 14.2V9.8C19 8.11984 19 7.27976 18.673 6.63803C18.3854 6.07354 17.9265 5.6146 17.362 5.32698C16.7202 5 15.8802 5 14.2 5H9.8C8.11984 5 7.27976 5 6.63803 5.32698C6.07354 5.6146 5.6146 6.07354 5.32698 6.63803C5 7.27976 5 8.11984 5 9.8V14.2C5 15.8802 5 16.7202 5.32698 17.362C5.6146 17.9265 6.07354 18.3854 6.63803 18.673C7.27976 19 8.11984 19 9.8 19Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Chip02.displayName = "IconChip02";
