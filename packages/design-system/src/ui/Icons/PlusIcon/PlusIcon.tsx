import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type PlusIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const PlusIcon: React.FC<PlusIconProps> = (props) => {
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
        d="M16 5.3C16 5.13431 15.8657 5 15.7 5H14.3C14.1343 5 14 5.13431 14 5.3V14H5.3C5.13431 14 5 14.1343 5 14.3V15.7C5 15.8657 5.13431 16 5.3 16H14V24.7004C14 24.866 14.1343 25.0004 14.3 25.0004H15.7C15.8657 25.0004 16 24.866 16 24.7004V16H24.7004C24.866 16 25.0004 15.8657 25.0004 15.7V14.3C25.0004 14.1343 24.866 14 24.7004 14H16V5.3Z"
      />
    </IconBase>
  );
};

export default PlusIcon;
