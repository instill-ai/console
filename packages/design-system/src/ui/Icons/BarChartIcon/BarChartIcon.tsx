import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type BarChartIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const BarChartIcon: React.FC<BarChartIconProps> = (props) => {
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
        d="M11.25 6C11.25 5.58579 11.5858 5.25 12 5.25H18C18.4142 5.25 18.75 5.58579 18.75 6V11.25H24C24.4142 11.25 24.75 11.5858 24.75 12V24C24.75 24.4142 24.4142 24.75 24 24.75H18H12H6C5.58579 24.75 5.25 24.4142 5.25 24V15C5.25 14.5858 5.58579 14.25 6 14.25H11.25V6ZM17.25 23.25V12V6.75H12.75V15V23.25H17.25ZM18.75 23.25H23.25V12.75H18.75V23.25ZM11.25 15.75V23.25H6.75V15.75H11.25Z"
      />
    </IconBase>
  );
};

export default BarChartIcon;
