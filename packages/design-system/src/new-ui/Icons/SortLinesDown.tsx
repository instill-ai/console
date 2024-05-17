"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const SortLinesDown = React.forwardRef<
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
            <path d="M6.94281 22V2" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 18L6.94281 22L2.94281 18" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 2H14.9428" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 7H18.9428" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 12H22.9428" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </IconBase>
    );
});
SortLinesDown.displayName = "IconSortLinesDown";
