import * as React from "react";
import SquareProgressBase, {
  SquareProgressBaseProps,
} from "../SquareProgressBase";

export type DarkBgSquareProgressOmitKeys =
  | "bgColor"
  | "cubeColor"
  | "animationDuration";

export type DarkBgSquareProgressProps = Omit<
  SquareProgressBaseProps,
  DarkBgSquareProgressOmitKeys
>;

export type DarkBgSquareProgressConfig = Pick<
  SquareProgressBaseProps,
  DarkBgSquareProgressOmitKeys
>;

export const darkBgSquareProgressConfig: DarkBgSquareProgressConfig = {
  bgColor: "bg-instillGrey80",
  cubeColor: "bg-instillBlue50",
  animationDuration: 3,
};

const DarkBgSquareProgress = (props: DarkBgSquareProgressProps) => {
  const { isLoading, position, blockSize } = props;

  return (
    <SquareProgressBase
      isLoading={isLoading}
      blockSize={blockSize}
      position={position}
      {...darkBgSquareProgressConfig}
    />
  );
};

export default DarkBgSquareProgress;
