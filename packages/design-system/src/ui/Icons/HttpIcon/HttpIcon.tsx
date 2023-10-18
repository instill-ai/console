import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type HttpIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const HttpIcon: React.FC<HttpIconProps> = (props) => {
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
        d="M15.6667 6.44444H18.1111L12.6111 23.5556H10.1667L15.6667 6.44444ZM8.94444 10.1111H6.5V12.5556H8.94444V10.1111ZM8.94444 17.4444H6.5V19.8889H8.94444V17.4444ZM23 6.44444H20.5556L15.0556 23.5556H17.5L23 6.44444Z"
      />
    </IconBase>
  );
};

export default HttpIcon;
