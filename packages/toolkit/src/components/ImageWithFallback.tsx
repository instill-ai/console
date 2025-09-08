"use client";

import * as React from "react";
import cn from "clsx";

import { useCheckNoContent } from "../lib";

export type ImageWithFallbackProps = {
  src: string;
  fallbackImg: React.ReactNode;
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
  const [noContent, setNoContent] = React.useState(false);
  const currentImageSrc = React.useRef<string>(src);

  const isNoContent = useCheckNoContent(src);

  React.useEffect(() => {
    if (currentImageSrc.current !== src) {
      currentImageSrc.current = src;
      setError(false);
      setNoContent(false);

      // In case like avatar image, we need to check if the image is empty
      // by fetching the image with GET method
      if (src) {
        (async () => {
          const noContent = await isNoContent();
          if (noContent) setNoContent(true);
        })();
      }
    }
  }, [src, isNoContent]);

  return !src || error ? (
    fallbackImg
  ) : (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      onError={() => {
        setError(true);
        if (src && !noContent) console.error(error);
      }}
      className={cn("shrink-0 grow-0", className)}
    />
  );
};
