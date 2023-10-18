import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const ATFSquare = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 60 60"
      className={className}
    >
      <path
        d="M33.3358 13.3211V19.9927H40.0073V33.3358H26.6642V26.6642H19.9927V40.0073H40.0073V46.6789H46.6789V13.3211H33.3358ZM26.6642 19.9927V26.6642H33.3358V19.9927H26.6642ZM19.9927 46.6789V40.0073H13.3211V46.6789H19.9927Z"
        fill="#F6F6F6"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30.0147 10H50V50H36.6862V43.3284H23.3138V50H10V36.6862H16.6716V23.3431H23.3431V16.6716H30.0147V10ZM33.3358 19.9927V13.3211H46.6789V46.6789H40.0073V40.0073H19.9927V26.6642H26.6642V33.3358H40.0073V19.9927H33.3358ZM36.6862 23.3138H36.6569V29.9853H29.9853V30.0147H36.6862V23.3138ZM26.6642 26.6642H33.3358V19.9927H26.6642V26.6642ZM19.9927 40.0073H13.3211V46.6789H19.9927V40.0073Z"
        fill="#2B2B2B"
      />
      <path
        d="M40.007 19.9931H46.6789V33.3345H40.007V19.9931Z"
        fill="#40A8F5"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M40.007 30.0134V33.3345H46.6789V30.0134H40.007Z"
        fill="#2B2B2B"
      />
      <path
        d="M33.2854 13.3207H46.6789L46.6789 19.9931H33.2854V13.3207Z"
        fill="#40A8F5"
      />
      <path
        d="M26.6662 33.3291H33.2854V40.0073H26.6662V33.3291Z"
        fill="#FFDF3A"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M29.9643 40.0073H33.2854V33.3291H29.9643V40.0073Z"
        fill="#2B2B2B"
      />
      <path d="M19.9919 26.664H26.6662V40.004H19.9919V26.664Z" fill="#FFDF3A" />
      <path
        d="M13.3211 40.0039L19.9919 40.004V46.6788L13.3211 46.6789L13.3211 40.0039Z"
        fill="#28F67E"
      />
    </LogoBase>
  );
});
ATFSquare.displayName = "ATFSquare";
