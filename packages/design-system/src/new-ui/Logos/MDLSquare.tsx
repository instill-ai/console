import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const MDLSquare = React.forwardRef<
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
        d="M19.9704 13.2625H13.2754V46.7375H19.9704V26.7481H26.6654V20.0531H19.9704V13.2625ZM40.0554 20.0531H33.3604V26.7481H40.0554V46.7375H46.7505V13.2625H40.0554V20.0531ZM33.3604 33.4431V26.7481H26.6654V33.4431H33.3604Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.2329 10V16.7907H29.9279V23.4857H30.098V16.7907H36.793V10H50.0129V50H36.793V30.0106H36.6229V36.7056H23.403V30.0106H23.2329V50H10.0129V10H23.2329ZM19.9704 13.2625V20.0531H26.6654V26.7481H19.9704V46.7375H13.2754V13.2625H19.9704ZM26.6654 26.7481V33.4431H33.3604V26.7481H40.0554V46.7375H46.7505V13.2625H40.0554V20.0531H33.3604V26.7481H26.6654Z"
        fill="#2B2B2B"
      />
      <path
        d="M13.2496 13.2625H20.1859V26.7995H13.2496V13.2625Z"
        fill="#FFDF3A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.98709 10H23.4483V30.062H9.98709V10ZM13.2496 13.2625V26.7995H20.1859V13.2625H13.2496Z"
        fill="#2B2B2B"
      />
      <path
        d="M19.9621 19.9751H26.6747V26.7995H19.9621V19.9751Z"
        fill="#FFDF3A"
      />
      <path
        d="M46.7508 46.7993H40.0559L40.0559 26.7471H46.7508V46.7993Z"
        fill="#40A8F5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.7508 30.0095V26.7471H40.0559L40.0559 30.0095H46.7508Z"
        fill="#2B2B2B"
      />
      <path
        d="M26.6573 26.7373H33.3613V33.4413H26.6573V26.7373Z"
        fill="#28F67E"
      />
    </LogoBase>
  );
});
MDLSquare.displayName = "MDLSquare";
