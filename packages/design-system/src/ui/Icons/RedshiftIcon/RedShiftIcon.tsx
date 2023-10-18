import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type RedShiftIconProps = Omit<
  IconBaseProps,
  "viewBox" | "color" | "fill"
>;

const RedShiftIcon: React.FC<RedShiftIconProps> = (props) => {
  const { width, height, position, style } = props;
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={width}
      height={height}
      position={position}
      style={style}
    >
      <path
        d="M14.8515 19.2797L21.0193 20.7721V9.19363L14.8515 10.6859V19.2797Z"
        fill="#205B98"
      />
      <path
        d="M21.0167 9.19363L22.2027 9.78663V20.1815L21.0167 20.7745V9.19363Z"
        fill="#5294CF"
      />
      <path
        d="M14.8513 19.2797L8.68594 20.7721V9.19363L14.8513 10.6859V19.2797Z"
        fill="#5294CF"
      />
      <path
        d="M8.68603 9.19363L7.5 9.78663V20.1815L8.68603 20.7745V9.19363Z"
        fill="#205B98"
      />
      <path
        d="M16.4295 23.1L18.7721 21.9311V8.07131L16.4295 6.89999L15.6943 14.6042L16.4295 23.1Z"
        fill="#5294CF"
      />
      <path
        d="M13.2733 23.1L10.9307 21.9311V8.07131L13.2733 6.89999L14.0085 14.5773L13.2733 23.1Z"
        fill="#205B98"
      />
      <path d="M16.4319 6.89999H13.2732V23.1H16.4319V6.89999Z" fill="#2D72B8" />
    </IconBase>
  );
};

export default RedShiftIcon;
