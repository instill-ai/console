import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type InstanceSegmentationIconProps = Omit<
  IconBaseProps,
  "viewBox" | "fill"
>;

const InstanceSegmentationIcon: React.FC<InstanceSegmentationIconProps> = (
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
        d="M14.7581 3.33044H5.45663V26.6106H14.7581V23.5069H19.3821V20.3975H24.595V11.0961H15.2935V14.2054H14.7581V3.33044ZM7.01342 25.0538V4.88723H13.2013V14.2054H10.0807V23.5069H13.2013V25.0538H7.01342ZM16.8503 14.2054V12.6528H23.0382V18.8407H19.3821V14.2054H16.8503ZM11.6374 21.9501V15.7622H13.2013V21.9501H11.6374ZM14.7581 21.9501V15.7622H15.2935V20.3975H17.8253V21.9501H14.7581ZM16.8503 18.8407V15.7622H17.8253V18.8407H16.8503Z"
      />
    </IconBase>
  );
};

export default InstanceSegmentationIcon;
