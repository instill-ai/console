import * as React from "react";
import SquareProgressBase, {
  SquareProgressBaseProps,
} from "../SquareProgressBase";

export type WhiteBgSquareProgressOmitKeys =
  | "bgColor"
  | "cubeColor"
  | "animationDuration";

export type WhiteBgSquareProgressConfig = Pick<
  SquareProgressBaseProps,
  WhiteBgSquareProgressOmitKeys
>;

export type WhiteBgSquareProgressProps = Omit<
  SquareProgressBaseProps,
  WhiteBgSquareProgressOmitKeys
>;

export const whiteBgSquareProgressConfig: WhiteBgSquareProgressConfig = {
  bgColor: "bg-white",
  cubeColor: "bg-instillBlue50",
  animationDuration: 3,
};

const WhiteBgSquareProgress = (props: WhiteBgSquareProgressProps) => {
  const { isLoading, position, blockSize } = props;

  return (
    <SquareProgressBase
      isLoading={isLoading}
      blockSize={blockSize}
      position={position}
      {...whiteBgSquareProgressConfig}
    />
  );
};

export default WhiteBgSquareProgress;
