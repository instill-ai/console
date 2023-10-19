import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type AsyncArrowsIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const AsyncArrowsIcon: React.FC<AsyncArrowsIconProps> = (props) => {
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
        d="M22.451 7L28 12.5657L27.4286 13.9494L2 13.9494L2 12.3283L25.4776 12.3283L21.3081 8.14627L22.451 7Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.4509 22.8987L23.3692 21.9777L22.2263 20.8315L21.3081 21.7524L22.4509 22.8987ZM24.3072 21.0369L26.1437 19.1949L25.0008 18.0486L23.1644 19.8906L24.3072 21.0369ZM27.0817 18.254L28 17.333L27.4285 15.9494H26.0907V16.9555L25.9389 17.1077L26.0907 17.26V17.5704H26.4002L27.0817 18.254ZM1.99995 15.9494V17.5704H3.33783V15.9494H1.99995ZM4.90018 17.5704H7.57592V15.9494H4.90018V17.5704ZM9.13827 17.5704H11.814V15.9494H9.13827V17.5704ZM13.3764 17.5704H16.0521V15.9494H13.3764V17.5704ZM17.6145 17.5704H20.2902V15.9494H17.6145V17.5704ZM21.8526 17.5704H24.5283V15.9494H21.8526V17.5704Z"
      />
    </IconBase>
  );
};

export default AsyncArrowsIcon;
