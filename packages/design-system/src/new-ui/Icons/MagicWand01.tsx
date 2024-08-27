"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const MagicWand01 = React.forwardRef<
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
        d="M13 14L9.99997 11M15.0103 3.5V2M18.9497 5.06066L20.0103 4M18.9497 13L20.0103 14.0607M11.0103 5.06066L9.94966 4M20.5103 9H22.0103M6.13134 20.8686L15.3686 11.6314C15.7646 11.2354 15.9626 11.0373 16.0368 10.809C16.1021 10.6082 16.1021 10.3918 16.0368 10.191C15.9626 9.96265 15.7646 9.76465 15.3686 9.36863L14.6313 8.63137C14.2353 8.23535 14.0373 8.03735 13.809 7.96316C13.6081 7.8979 13.3918 7.8979 13.191 7.96316C12.9626 8.03735 12.7646 8.23535 12.3686 8.63137L3.13134 17.8686C2.73532 18.2646 2.53732 18.4627 2.46313 18.691C2.39787 18.8918 2.39787 19.1082 2.46313 19.309C2.53732 19.5373 2.73533 19.7354 3.13134 20.1314L3.8686 20.8686C4.26462 21.2646 4.46263 21.4627 4.69095 21.5368C4.8918 21.6021 5.10814 21.6021 5.30899 21.5368C5.53732 21.4627 5.73533 21.2646 6.13134 20.8686Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
MagicWand01.displayName = "IconMagicWand01";
