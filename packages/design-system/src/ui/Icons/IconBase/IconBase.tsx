import React from "react";
import cn from "clsx";

export interface IconBaseProps {
  /** The viewbox of target icon
   * - e.g. "0 0 32 32"
   */
  viewBox: string;

  /** TailwindCSS format - The width of icon. */
  width?: string;

  /** TailwindCSS format - The height of icon. */
  height?: string;

  /** TailwindCSS format - The color of icon.
   * - Please use fill color to modify icon's color
   * - e.g. fill-gray-300
   */
  color?: string;

  /** TailwindCSS format - The position of icon.
   * - Please use margin auto to control the position of icon
   */
  position?: string;

  /** TailwindCSS format - The rotation of icon */
  rotate?: string;

  /** Svg fill attribute
   * - If present, IconBase won't have fill-current class
   */
  fill?: string;

  children?: React.ReactNode;

  // Svg width and height for dynamic values
  style?: {
    width: string;
    height: string;
  };
}

const IconBase = ({
  viewBox,
  children,
  width,
  height,
  color,
  position,
  rotate,
  fill,
  style,
}: IconBaseProps) => {
  if (style) {
    if (width) {
      throw new Error(
        "Should not use style props together with utility class - width"
      );
    }

    if (height) {
      throw new Error(
        "Should not use style props together with utility class - height"
      );
    }
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={cn("flex", width, height, color, position, rotate)}
      fill={fill}
      style={style}
    >
      {children}
    </svg>
  );
};

export default IconBase;
