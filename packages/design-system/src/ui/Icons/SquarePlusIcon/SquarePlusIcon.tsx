import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type SquarePlusIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const SquarePlusIcon: React.FC<SquarePlusIconProps> = (props) => {
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
        d="M5.30788 4.5C4.8618 4.5 4.50018 4.86162 4.50018 5.30769V24.6923C4.50018 25.1384 4.8618 25.5 5.30788 25.5H24.6925C25.1386 25.5 25.5002 25.1384 25.5002 24.6923V5.30769C25.5002 4.86162 25.1386 4.5 24.6925 4.5H5.30788ZM6.00018 24V6H24.0002V24H6.00018ZM15.6548 8.31836C15.8205 8.31836 15.9548 8.45267 15.9548 8.61836V14.0459H21.3822C21.5479 14.0459 21.6822 14.1802 21.6822 14.3459V15.2459C21.6822 15.4116 21.5479 15.5459 21.3822 15.5459H15.9548V21.382C15.9548 21.5477 15.8205 21.682 15.6548 21.682H14.7548C14.5891 21.682 14.4548 21.5477 14.4548 21.382V15.5459H8.6186C8.45292 15.5459 8.3186 15.4116 8.3186 15.2459V14.3459C8.3186 14.1802 8.45292 14.0459 8.61861 14.0459H14.4548V8.61836C14.4548 8.45267 14.5891 8.31836 14.7548 8.31836H15.6548Z"
      />
    </IconBase>
  );
};

export default SquarePlusIcon;
