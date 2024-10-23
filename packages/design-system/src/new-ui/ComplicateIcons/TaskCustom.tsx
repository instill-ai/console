"use client";

import * as React from "react";

import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const TaskCustom = React.forwardRef<
  SVGSVGElement,
  Omit<ComplicateIconBaseProps, "viewBox" | "children"> & {
    pathColor: string;
  }
>((props, ref) => {
  const { className, pathColor, ...passThrough } = props;
  return (
    <ComplicateIconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M7.6863 18.1797V14.1797M7.6863 14.1797C8.42268 14.1797 9.01963 13.5827 9.01963 12.8464C9.01963 12.11 8.42268 11.513 7.6863 11.513C6.94992 11.513 6.35297 12.11 6.35297 12.8464C6.35297 13.5827 6.94992 14.1797 7.6863 14.1797ZM7.6863 8.84635V6.17969M12.353 18.1797V14.1797M12.353 8.84635V6.17969M12.353 8.84635C11.6166 8.84635 11.0196 9.44331 11.0196 10.1797C11.0196 10.9161 11.6166 11.513 12.353 11.513C13.0893 11.513 13.6863 10.9161 13.6863 10.1797C13.6863 9.44331 13.0893 8.84635 12.353 8.84635ZM17.0196 18.1797V15.513M17.0196 15.513C17.756 15.513 18.353 14.9161 18.353 14.1797C18.353 13.4433 17.756 12.8464 17.0196 12.8464C16.2833 12.8464 15.6863 13.4433 15.6863 14.1797C15.6863 14.9161 16.2833 15.513 17.0196 15.513ZM17.0196 10.1797V6.17969M8.15297 21.1807H16.553C18.2331 21.1807 19.0732 21.1807 19.7149 20.8537C20.2794 20.5661 20.7384 20.1071 21.026 19.5426C21.353 18.9009 21.353 18.0608 21.353 16.3807V7.98066C21.353 6.30051 21.353 5.46043 21.026 4.81869C20.7384 4.25421 20.2794 3.79526 19.7149 3.50764C19.0732 3.18066 18.2331 3.18066 16.553 3.18066H8.15297C6.47281 3.18066 5.63273 3.18066 4.99099 3.50764C4.42651 3.79526 3.96757 4.25421 3.67995 4.81869C3.35297 5.46043 3.35297 6.30051 3.35297 7.98066V16.3807C3.35297 18.0608 3.35297 18.9009 3.67995 19.5426C3.96757 20.1071 4.42651 20.5661 4.99099 20.8537C5.63273 21.1807 6.47281 21.1807 8.15297 21.1807Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathColor}
      />
    </ComplicateIconBase>
  );
});
TaskCustom.displayName = "TaskCustomIcon";
