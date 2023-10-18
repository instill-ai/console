import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type SyncArrowsIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const SyncArrowsIcon: React.FC<SyncArrowsIconProps> = (props) => {
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
        d="M22.451 7L28 12.5657L27.4286 13.9494H2.00002V12.3283H25.4776L21.3081 8.14627L22.451 7Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.54903 23.1654L2 17.5997L2.57142 16.216L28 16.216L28 17.8371L4.52238 17.8371L8.69188 22.0191L7.54903 23.1654Z"
      />
    </IconBase>
  );
};

export default SyncArrowsIcon;
