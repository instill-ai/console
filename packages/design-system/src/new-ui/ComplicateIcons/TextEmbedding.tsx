import * as React from "react";
import { IconBase, IconBaseProps } from "../Icons/IconBase";

export const TextEmbedding = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
    pathColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, pathColor, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 25 24"
      className={className}
    >
      <path
        className={fillAreaColor}
        d="M6.88475 7.01327V10.6136H10.4834V17.8124H14.0838V10.6136H17.6785V7.01327H6.88475Z"
      />
      <path
        className={pathColor}
        d="M17.1841 20.9127H14.5838V18.3124H17.1841V20.9127Z"
      />
      <path
        className={pathColor}
        d="M3.78443 3.91291L6.38477 3.91291L6.38477 6.51324H3.78443L3.78443 3.91291Z"
      />
      <path
        className={pathColor}
        d="M3.78443 11.1117H6.38477L6.38477 13.7121H3.78443L3.78443 11.1117Z"
      />
      <path
        className={pathColor}
        d="M18.1841 3.91291L20.7844 3.91291V6.51324H18.1841V3.91291Z"
      />
      <path
        className={pathColor}
        d="M18.1841 11.1117H20.7844V13.7121H18.1841V11.1117Z"
      />
      <path
        className={pathColor}
        d="M7.38475 18.3124H9.98508V20.9127H7.38475V18.3124Z"
      />
    </IconBase>
  );
});
TextEmbedding.displayName = "TextEmbeddingIcon";
