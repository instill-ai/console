import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Recording04 = React.forwardRef<
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
        d="M5.97852 11.0004V13.0004M9.97852 9.00038V15.0004M13.9785 7.00038V17.0004M17.9785 11.0004V13.0004M7.80027 21.0004H16.2003C17.8804 21.0004 18.7205 21.0004 19.3622 20.6734C19.9267 20.3858 20.3857 19.9268 20.6733 19.3624C21.0003 18.7206 21.0003 17.8805 21.0003 16.2004V7.80038C21.0003 6.12022 21.0003 5.28015 20.6733 4.63841C20.3857 4.07392 19.9267 3.61498 19.3622 3.32736C18.7205 3.00038 17.8804 3.00038 16.2003 3.00038H7.80027C6.12012 3.00038 5.28004 3.00038 4.6383 3.32736C4.07382 3.61498 3.61488 4.07392 3.32726 4.63841C3.00027 5.28015 3.00027 6.12022 3.00027 7.80038V16.2004C3.00027 17.8805 3.00027 18.7206 3.32726 19.3624C3.61488 19.9268 4.07382 20.3858 4.6383 20.6734C5.28004 21.0004 6.12012 21.0004 7.80027 21.0004Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Recording04.displayName = "IconRecording04";
