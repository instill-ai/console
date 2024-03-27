"use client";

import * as React from "react";
import cn from "clsx";

export type ImageWithFallbackProps = {
  src: string;
  fallbackImg: React.ReactElement;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export const ImageWithFallback = ({
  src,
  fallbackImg,
  alt,
  width,
  height,
  className,
}: ImageWithFallbackProps) => {
  const [error, setError] = React.useState(false);
  return error ? (
    fallbackImg
  ) : (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      onError={() => {
        setError(true);
        console.error(error);
      }}
      className={cn("shrink-0 grow-0", className)}
    />
  );
};
