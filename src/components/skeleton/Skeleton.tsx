import React from "react";
import cn from "clsx";

type SkeletonProps = {
  width: string;
  hight: string;
  classname?: string;
  animationHeight?: string;
  animationWidth?: string;
  animationClassname?: string;
};

export const Skeleton = ({
  width,
  hight,
  classname,
  animationWidth,
  animationHeight,
  animationClassname,
}: SkeletonProps) => {
  return (
    <div className={cn("flex flex-row gap-x-2", width, hight, classname)}>
      <div
        className={cn(
          "flex-1 animate-pulse bg-[#D9D9D9]",
          animationWidth,
          animationHeight,
          animationClassname
        )}
      />
    </div>
  );
};
