"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const HTMLFile = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 40 40"
      className={className}
    >
      <path
        d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z"
        fill="#D97512"
      />
      <path
        opacity="0.3"
        d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z"
        fill="white"
      />
      <path
        d="M12.4975 29.426H10.1035V32H8.73548V25.718H10.1035V28.22H12.4975V25.718H13.8655V32H12.4975V29.426ZM17.8672 26.933V32H16.4992V26.933H14.7982V25.718H19.5682V26.933H17.8672ZM25.202 27.878H25.175L24.716 28.796L23.492 31.019L22.295 28.805L21.818 27.815H21.791V32H20.504V25.718H21.953L23.492 28.661H23.51L25.031 25.718H26.489V32H25.202V27.878ZM27.8781 32V25.718H29.2461V30.785H31.6401V32H27.8781Z"
        fill="white"
      />
    </IconBase>
  );
});
HTMLFile.displayName = "IconHTMLFile";
