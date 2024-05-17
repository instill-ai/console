"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const SortLinesUp = React.forwardRef<
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
            <path d="M6.94281 2V22" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 6L6.94281 2L2.94281 6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 22H14.9428" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 17H18.9428" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.9428 12H22.9428" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </IconBase >
    );
});
SortLinesUp.displayName = "IconSortLinesUp";
