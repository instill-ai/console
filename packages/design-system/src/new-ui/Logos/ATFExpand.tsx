import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const ATFExpand = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 75 27"
      className={className}
    >
      <path
        d="M15.2832 2.47975V6.81581H19.6192V15.4879H10.9471V11.1519H6.61109V19.824H19.6192V24.16H23.9553V2.47975H15.2832ZM10.9471 6.81581V11.1519H15.2832V6.81581H10.9471ZM6.61109 24.16V19.824H2.27504V24.16H6.61109Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.1233 0.319885H26.1152V26.3199H17.4594V21.9838H8.77096V26.3199H0.115173V17.6641H4.45122V8.99199H8.78728V4.65594H13.1233V0.319885ZM15.2832 6.81581V2.47975H23.9553V24.16H19.6192V19.824H6.61109V11.1519H10.9471V15.4879H19.6192V6.81581H15.2832ZM17.4594 8.97567H17.4431V13.3117H13.107V13.328H17.4594V8.97567ZM10.9471 11.1519H15.2832V6.81581H10.9471V11.1519ZM6.61109 19.824H2.27504V24.16H6.61109V19.824Z"
        fill="#2B2B2B"
      />
      <path
        d="M54.3018 2.47976V6.81581H67.31V2.47976H54.3018ZM49.9658 24.16H54.3018V15.4879H67.31V11.1519H54.3018V6.81581H49.9658V24.16Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52.142 0.319889H69.4699V8.97568H56.4617V8.99199H69.4699V17.6478H56.4617V26.3199H47.8059V4.65594H52.142V0.319889ZM54.3018 6.81581V11.1519H67.31V15.4879H54.3018V24.16H49.9658V6.81581H54.3018ZM54.3018 6.81581H67.31V2.47976H54.3018V6.81581Z"
        fill="#2B2B2B"
      />
      <path
        d="M49.9658 15.4885H54.3005V24.16L49.9658 24.16V15.4885Z"
        fill="#40A8F5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.3005 17.6484H49.9658V15.4885H54.3005V17.6484Z"
        fill="#2B2B2B"
      />
      <path
        d="M47.8048 2.47976H26.1246V6.81581H34.7967V24.16H39.1327V6.81581H47.8048V2.47976Z"
        fill="#F6F6F6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.9647 0.319889V8.97568H41.2926V26.3199H32.6368V8.97568H23.9647V0.319889H49.9647ZM26.1246 6.81581V2.47976H47.8048V6.81581H39.1327V24.16H34.7967V6.81581H26.1246Z"
        fill="#2B2B2B"
      />
      <path
        d="M34.7911 6.81758H39.1344V11.1558H34.7911V6.81758Z"
        fill="#FFDF3A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.7911 11.1558V13.3157H39.1344V11.1558H34.7911Z"
        fill="#2B2B2B"
      />
      <path
        d="M39.1344 2.47976L39.1344 6.81758L26.121 6.81758V2.47976L39.1344 2.47976Z"
        fill="#FFDF3A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.2943 6.81758L39.1344 6.81758L39.1344 2.47976H41.2943V6.81758Z"
        fill="#2B2B2B"
      />
      <path
        d="M2.27504 19.8218H6.61061V24.16L2.27504 24.16V19.8218Z"
        fill="#28F67E"
      />
    </LogoBase>
  );
});
ATFExpand.displayName = "ATFExpand";
