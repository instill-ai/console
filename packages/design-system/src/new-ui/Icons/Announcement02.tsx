"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Announcement02 = React.forwardRef<
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
        d="M4 14L5.57465 20.2985C5.61893 20.4757 5.64107 20.5643 5.66727 20.6416C5.92317 21.3971 6.60352 21.9283 7.39852 21.9933C7.4799 22 7.5712 22 7.75379 22C7.98244 22 8.09677 22 8.19308 21.9906C9.145 21.8983 9.89834 21.145 9.99066 20.193C10 20.0967 10 19.9824 10 19.7538V5.49997M18.5 13.5C20.433 13.5 22 11.933 22 9.99997C22 8.06698 20.433 6.49997 18.5 6.49997M10.25 5.49997H6.5C4.01472 5.49997 2 7.51469 2 9.99998C2 12.4853 4.01472 14.5 6.5 14.5H10.25C12.0164 14.5 14.1772 15.4469 15.8443 16.3556C16.8168 16.8858 17.3031 17.1508 17.6216 17.1118C17.9169 17.0757 18.1402 16.9431 18.3133 16.7011C18.5 16.4401 18.5 15.918 18.5 14.8737V5.12626C18.5 4.08197 18.5 3.55982 18.3133 3.29886C18.1402 3.05687 17.9169 2.92427 17.6216 2.8881C17.3031 2.84909 16.8168 3.11417 15.8443 3.64433C14.1772 4.55309 12.0164 5.49997 10.25 5.49997Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Announcement02.displayName = "IconAnnouncement02";
