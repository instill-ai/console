import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type TensorFlowIconProps = Omit<
  IconBaseProps,
  "viewBox" | "fill" | "color"
>;

const TensorFlowIcon: React.FC<TensorFlowIconProps> = (props) => {
  const { width, height, position, style } = props;
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={width}
      height={height}
      position={position}
      style={style}
      fill="none"
    >
      <path
        d="M13.3038 15.6958L16.7384 13.703L20.1304 15.6958L16.7384 17.6465L13.3038 15.7384V15.6958ZM3 9.80216L16.7384 2L26.9575 7.80899L23.5654 13.703L16.7388 9.80216L6.43499 15.6537L3 9.80216Z"
        fill="#F6BD3A"
      />
      <path
        d="M13.3038 23.4981V19.5972L16.6958 17.6466L20.1304 15.6959V19.5968L16.7384 21.5475V25.4483L13.3038 27.4415V23.4981ZM13.3038 15.6959L9.86919 13.7453L6.4346 15.6534V11.7525L16.7384 5.901V13.7032L13.3038 15.6959ZM23.5229 11.7525V9.80188L26.9575 7.80911L27 11.71L23.5654 13.7028L23.5229 11.7525Z"
        fill="#EB8C23"
      />
      <path
        d="M9.86918 25.3637V13.7457L13.2612 11.8376L13.3038 15.6963L16.7384 17.6044V21.5479L13.3038 19.7244V27.4415L9.86918 25.3637ZM4.69623 14.6361L3 13.6185V9.80228L6.43459 11.7529V15.6538L4.69623 14.6361ZM16.7384 9.80228V5.901L23.5229 9.80188L23.5654 13.7028L16.7388 9.80188L16.7384 9.80228Z"
        fill="#E35A2B"
      />
    </IconBase>
  );
};

export default TensorFlowIcon;
