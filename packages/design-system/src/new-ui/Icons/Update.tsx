"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Update = React.forwardRef<
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
            <path d="M18.4532 10.8928C18.1754 13.5027 16.6967 15.9484 14.2497 17.3612C10.1842 19.7084 4.98566 18.3155 2.63845 14.25L2.38845 13.817M1.54617 9.10713C1.82397 6.49723 3.30276 4.05151 5.74974 2.63874C9.81523 0.291528 15.0138 1.68447 17.361 5.74995L17.611 6.18297M1.49316 16.0659L2.22522 13.3339L4.95727 14.0659M15.0422 5.93398L17.7743 6.66603L18.5063 3.93398M9.99974 5.49995V9.99995L12.4997 11.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </IconBase>
    );
});
Update.displayName = "IconUpdate";
