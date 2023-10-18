import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type SemanticSegmentationIconProps = Omit<
  IconBaseProps,
  "viewBox" | "fill"
>;

const SemanticSegmentationIcon: React.FC<SemanticSegmentationIconProps> = (
  props
) => {
  const { width, height, position, style, color } = props;
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={width}
      height={height}
      color={color}
      position={position}
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6634 3.33044H5.36198V26.6106H14.6634V23.5069H18.2874V20.3975H24.5003V11.0961H15.1989V14.2054H14.6634V3.33044ZM6.91877 25.0538V4.88723H13.1066V15.7622H16.7557V12.6528H22.9435V18.8407H16.7306V21.9501H13.1066V25.0538H6.91877Z"
      />
    </IconBase>
  );
};

export default SemanticSegmentationIcon;
