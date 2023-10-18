import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type DataSourceIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const DataSourceIcon: React.FC<DataSourceIconProps> = (props) => {
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
        d="M5.20673 4.5C4.81641 4.5 4.5 4.81641 4.5 5.20673V22.1683C4.5 22.5586 4.81641 22.875 5.20673 22.875H7.125V24.7933C7.125 25.1836 7.44141 25.5 7.83173 25.5H24.7933C25.1836 25.5 25.5 25.1836 25.5 24.7933V7.83173C25.5 7.44141 25.1836 7.125 24.7933 7.125H22.875V5.20673C22.875 4.81641 22.5586 4.5 22.1683 4.5H5.20673ZM22.875 8.4375V22.1683C22.875 22.5586 22.5586 22.875 22.1683 22.875H8.4375V24.1875H24.1875V8.4375H22.875ZM5.8125 21.5625V5.8125H21.5625V21.5625H5.8125ZM11.5 13.5L7.5 19.5H19.5L16.5 14.7L14.47 17.952L11.5 13.5ZM19.5 9C19.5 9.82843 18.8284 10.5 18 10.5C17.1716 10.5 16.5 9.82843 16.5 9C16.5 8.17157 17.1716 7.5 18 7.5C18.8284 7.5 19.5 8.17157 19.5 9Z"
      />
    </IconBase>
  );
};

export default DataSourceIcon;
