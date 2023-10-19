import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type DocIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const DocIcon: React.FC<DocIconProps> = (props) => {
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
        d="M7.86111 4.5H16.4722C16.7006 4.5 16.9196 4.5856 17.0811 4.73798L22.2478 9.61298C22.4093 9.76535 22.5 9.97201 22.5 10.1875V24.6875C22.5 25.1362 22.1145 25.5 21.6389 25.5H7.86111C7.38553 25.5 7 25.1362 7 24.6875V5.3125C7 4.86377 7.38553 4.5 7.86111 4.5ZM8.72222 6.125V23.875H20.7778V10.524L16.1155 6.125H8.72222Z"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M19 15.5H10V14H19V15.5Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 18.5H10V17H17.5V18.5Z"
      />
    </IconBase>
  );
};

export default DocIcon;
