import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type PinIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const PinIcon: React.FC<PinIconProps> = (props) => {
  const { width, height, position, style, color } = props;
  return (
    <IconBase
      viewBox="0 0 24 25"
      width={width}
      height={height}
      color={color}
      position={position}
      style={style}
    >
      <path d="M12 12.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8c0-3.63-2.65-6.2-6-6.2s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zm-6-8.2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8 0-4.98 3.8-8.2 8-8.2z" />
    </IconBase>
  );
};

export default PinIcon;
