"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const TextGenerationChat = React.forwardRef<
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
        d="M7.67899 8.5H12.679M7.67899 12H15.679M10.3627 18H16.879C18.5591 18 19.3992 18 20.041 17.673C20.6054 17.3854 21.0644 16.9265 21.352 16.362C21.679 15.7202 21.679 14.8802 21.679 13.2V7.8C21.679 6.11984 21.679 5.27976 21.352 4.63803C21.0644 4.07354 20.6054 3.6146 20.041 3.32698C19.3992 3 18.5591 3 16.879 3H8.47899C6.79883 3 5.95875 3 5.31701 3.32698C4.75253 3.6146 4.29359 4.07354 4.00597 4.63803C3.67899 5.27976 3.67899 6.11984 3.67899 7.8V20.3355C3.67899 20.8684 3.67899 21.1348 3.78821 21.2716C3.88321 21.3906 4.02726 21.4599 4.17953 21.4597C4.35461 21.4595 4.56266 21.2931 4.97874 20.9602L7.3642 19.0518C7.8515 18.662 8.09515 18.4671 8.36647 18.3285C8.60718 18.2055 8.86341 18.1156 9.1282 18.0613C9.42665 18 9.73868 18 10.3627 18Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
TextGenerationChat.displayName = "IconTextGenerationChat";
