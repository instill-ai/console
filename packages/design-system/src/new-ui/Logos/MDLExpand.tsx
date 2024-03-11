"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const MDLExpand = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 75 26"
      className={className}
    >
      <path
        d="M54.1935 2.11281H49.8148V23.851H67.2053V19.4723H54.1935V2.11281Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M56.3063 0V17.3595H69.3181V25.9638H47.702V0H56.3063ZM67.2053 19.4723V23.851H49.8148V2.11281H54.1935V19.4723H67.2053Z"
        fill="#2B2B2B"
      />
      <path
        d="M49.8148 2.11281H54.2408V6.46625H49.8148V2.11281Z"
        fill="#40A8F5"
      />
      <path
        d="M49.8148 6.46625H54.2408L54.2408 10.8197H49.8148L49.8148 6.46625Z"
        fill="#40A8F5"
      />
      <path
        d="M49.8148 10.8197H54.2408V15.1731H49.8148V10.8197Z"
        fill="#40A8F5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.8148 14.1167H54.2408V16.2295H49.8148V14.1167Z"
        fill="#2B2B2B"
      />
      <path
        d="M43.3543 6.49664V2.149H25.9638V23.8872H43.3543V19.5396H30.3114V6.49664H43.3543ZM43.3543 19.5396H47.702V6.49664H43.3543V19.5396Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.4672 0.0361942V4.38383H49.8148V21.6524H45.4672V26H23.851V0.0361942H45.4672ZM43.3543 19.5396V23.8872H25.9638V2.149H43.3543V6.49664H30.3114V19.5396H43.3543ZM32.4242 17.4267H41.2415V8.60945H32.4242V17.4267ZM43.3543 6.49664V19.5396H47.702V6.49664H43.3543Z"
        fill="#2B2B2B"
      />
      <path
        d="M25.9638 19.5628H30.3173V23.9162H25.9638V19.5628Z"
        fill="#FFDF3A"
      />
      <path
        d="M30.2689 19.4902H34.6223V23.9162H30.2689V19.4902Z"
        fill="#FFDF3A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.5659 23.9162V19.4902H35.6787V23.9162H33.5659Z"
        fill="#2B2B2B"
      />
      <path
        d="M30.3173 19.5628H25.9638L25.9638 15.2093H30.3173L30.3173 19.5628Z"
        fill="#FFDF3A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.3173 16.2657H25.9638V14.1529H30.3173V16.2657Z"
        fill="#2B2B2B"
      />
      <path
        d="M6.46044 2.14896H2.11281V23.8871H6.46044V10.9063H10.8081V6.5587H6.46044V2.14896ZM19.5034 6.5587H15.1557V10.9063H19.5034V23.8871H23.851V2.14896H19.5034V6.5587ZM15.1557 15.254V10.9063H10.8081V15.254H15.1557Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.57325 0.0361487V4.4459H12.9209V8.79353H13.0429V4.4459H17.3905V0.0361487H25.9638V26H17.3905V13.0192H17.2685V17.3668H8.69527V13.0192H8.57325V26H0V0.0361487H8.57325ZM6.46044 2.14896V6.5587H10.8081V10.9063H6.46044V23.8871H2.11281V2.14896H6.46044ZM10.8081 10.9063V15.254H15.1557V10.9063H19.5034V23.8871H23.851V2.14896H19.5034V6.5587H15.1557V10.9063H10.8081Z"
        fill="#2B2B2B"
      />
      <path
        d="M10.8028 10.8994H15.1562V15.2529H10.8028V10.8994Z"
        fill="#28F67E"
      />
    </LogoBase>
  );
});
MDLExpand.displayName = "MDLExpand";
