import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type PenIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const PenIcon: React.FC<PenIconProps> = (props) => {
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
        d="M22.2855 3.10355H21.3713L17.9973 6.47752L23.6868 12.167L27.0608 8.79303V7.87881L22.2855 3.10355ZM21.3724 7.73127L20.1187 6.47752L21.8284 4.76776L23.0822 6.02151L21.3724 7.73127ZM23.6868 10.0457L22.4331 8.79193L24.1428 7.08217L25.3966 8.33592L23.6868 10.0457ZM22.9005 12.9533L17.2111 7.26383L5.47355 19.0013L3.06598 26.248L3.91639 27.0984L11.163 24.6908L22.9005 12.9533ZM8.44375 20.6599L7.19001 19.4062L17.2111 9.38515L18.4648 10.6389L8.44375 20.6599ZM10.7582 22.9743L9.50441 21.7206L19.5255 11.6995L20.7792 12.9533L10.7582 22.9743ZM9.36879 23.7063L6.45806 20.7956L5.88955 22.5067L7.65761 24.2748L9.36879 23.7063Z"
      />
    </IconBase>
  );
};

export default PenIcon;
