"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const InstillCloud = React.forwardRef<
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
        d="M21.4286 14.8167V10.55H38.5714V14.8167H21.4286Z"
        fill="#2B2B2B"
      />
      <path
        d="M42.8571 19.0833H38.5714L38.5714 14.8167L42.8571 14.8166V19.0833Z"
        fill="#2B2B2B"
      />
      <path
        d="M42.8571 19.0833L47.1428 19.0833V23.3499H42.8571L42.8571 19.0833Z"
        fill="#2B2B2B"
      />
      <path
        d="M21.4286 14.8167L21.4286 19.0833H17.1429V23.3499H8.57153V19.0833L17.1429 19.0833L17.1429 14.8166L21.4286 14.8167Z"
        fill="#2B2B2B"
      />
      <path
        d="M8.57153 23.3499L8.5714 27.6167H4.28571V40.4166H0V27.6167L4.28571 27.6167L4.28569 23.35L8.57153 23.3499Z"
        fill="#2B2B2B"
      />
      <path
        d="M8.5714 40.4167V44.6833H4.28569L4.28571 40.4166L8.5714 40.4167Z"
        fill="#2B2B2B"
      />
      <path
        d="M8.5714 44.6833L47.1428 44.6833V48.95H8.57153L8.5714 44.6833Z"
        fill="#2B2B2B"
      />
      <path
        d="M47.1429 27.6167L47.1428 23.3499L55.7143 23.35V27.6167H47.1429Z"
        fill="#2B2B2B"
      />
      <path
        d="M55.7143 27.6167L60 27.6167V40.4166H55.7143L55.7143 27.6167Z"
        fill="#2B2B2B"
      />
      <path
        d="M55.7143 44.6833L55.7143 40.4166L51.4286 40.4167V44.6833L47.1428 44.6833V48.95H51.4286L51.4286 44.6833H55.7143Z"
        fill="#2B2B2B"
      />
      <path
        d="M55.7142 40.4152H51.4385V44.6809H8.55961V40.4078H4.27936V27.6122H8.57156L8.57153 23.3499L17.1559 23.351V19.0779H21.4243V14.8166H38.5573V19.0779H42.8496V23.351H47.1299V27.636H55.7142V40.4152Z"
        fill="#F6F6F6"
      />
      <path
        d="M12.851 44.6833V40.4167H8.56533V44.6833H12.851Z"
        fill="#FFDF3A"
      />
      <path d="M12.851 40.4167V36.15H8.56533V40.4167H12.851Z" fill="#FFDF3A" />
      <path
        d="M20.7941 27.6166V23.3499H16.5084V27.6166H20.7941Z"
        fill="#28F67E"
      />
      <path
        d="M46.9282 31.8832V27.6166H42.6425V31.8832H46.9282Z"
        fill="#40A8F5"
      />
      <path
        d="M42.6424 36.15L42.6425 31.8832L38.3567 31.8834V36.15H42.6424Z"
        fill="#40A8F5"
      />
      <path
        d="M8.56533 40.4167V36.15L4.2795 36.15V40.4166L8.56533 40.4167Z"
        fill="#FFDF3A"
      />
    </LogoBase>
  );
});
InstillCloud.displayName = "InstillCloud";
