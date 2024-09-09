"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const TaskCustom = React.forwardRef<
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
        d="M8.27648 18.1797V14.1797M8.27648 14.1797C9.01286 14.1797 9.60981 13.5827 9.60981 12.8464C9.60981 12.11 9.01286 11.513 8.27648 11.513C7.5401 11.513 6.94315 12.11 6.94315 12.8464C6.94315 13.5827 7.5401 14.1797 8.27648 14.1797ZM8.27648 8.84635V6.17969M12.9431 18.1797V14.1797M12.9431 8.84635V6.17969M12.9431 8.84635C12.2068 8.84635 11.6098 9.44331 11.6098 10.1797C11.6098 10.9161 12.2068 11.513 12.9431 11.513C13.6795 11.513 14.2765 10.9161 14.2765 10.1797C14.2765 9.44331 13.6795 8.84635 12.9431 8.84635ZM17.6098 18.1797V15.513M17.6098 15.513C18.3462 15.513 18.9431 14.9161 18.9431 14.1797C18.9431 13.4433 18.3462 12.8464 17.6098 12.8464C16.8734 12.8464 16.2765 13.4433 16.2765 14.1797C16.2765 14.9161 16.8734 15.513 17.6098 15.513ZM17.6098 10.1797V6.17969M8.74315 21.1807H17.1431C18.8233 21.1807 19.6634 21.1807 20.3051 20.8537C20.8696 20.5661 21.3285 20.1071 21.6162 19.5426C21.9431 18.9009 21.9431 18.0608 21.9431 16.3807V7.98066C21.9431 6.30051 21.9431 5.46043 21.6162 4.81869C21.3285 4.25421 20.8696 3.79526 20.3051 3.50764C19.6634 3.18066 18.8233 3.18066 17.1431 3.18066H8.74315C7.06299 3.18066 6.22291 3.18066 5.58117 3.50764C5.01669 3.79526 4.55775 4.25421 4.27013 4.81869C3.94315 5.46043 3.94315 6.30051 3.94315 7.98066V16.3807C3.94315 18.0608 3.94315 18.9009 4.27013 19.5426C4.55775 20.1071 5.01669 20.5661 5.58117 20.8537C6.22291 21.1807 7.06299 21.1807 8.74315 21.1807Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
TaskCustom.displayName = "IconTaskCustom";
