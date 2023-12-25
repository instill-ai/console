import * as React from "react";
import cn from "clsx";
import "./SquareProgressBase.css";
import { Nullable } from "../../../types/general";

export interface SquareProgressBaseProps {
  /** TailwindCSS format - Loading status block's background color
   * - bg-instillGrey30
   */
  bgColor: Nullable<string>;

  /** TailwindCSS format - Loading status cube's background color */
  cubeColor: string;

  /** Whether it is at loading status */
  isLoading: boolean;

  /** Anumation duration */
  animationDuration: number;

  /** The size of whole progress in pixel, the innerBlock and padding will depend on the number */
  blockSize: number;

  /** The position of the progress
   * - e.g. mb-auto
   */
  position?: string;
}

const SquareProgressBase = (props: SquareProgressBaseProps) => {
  const {
    bgColor,
    cubeColor,
    isLoading,
    animationDuration,
    blockSize,
    position,
  } = props;

  return (
    <div
      className={cn("relative", bgColor, position)}
      style={{ width: `${blockSize}px`, height: `${blockSize}px` }}
    >
      <div
        className={cn("absolute block", cubeColor, {
          "loading-animation": isLoading,
        })}
        style={{
          top: `${blockSize / 9}px`,
          left: `${blockSize / 9}px`,
          width: `${blockSize / 3}px`,
          height: `${blockSize / 3}px`,
          animationDuration: isLoading ? `${animationDuration}s` : "",
        }}
      />
    </div>
  );
};

export default SquareProgressBase;
