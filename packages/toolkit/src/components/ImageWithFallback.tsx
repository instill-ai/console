import Image from "next/image";
import * as React from "react";

export type ImageWithFallbackProps = {
  src: string;
  fallbackImg: React.ReactElement;
  alt: string;
  width: number;
  height: number;
};

export const ImageWithFallback = ({
  src,
  fallbackImg,
  alt,
  width,
  height,
}: ImageWithFallbackProps) => {
  const [error, setError] = React.useState(false);
  return error ? (
    fallbackImg
  ) : (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      onError={() => {
        setError(true);
      }}
      className="flex-shrink-0"
    />
  );
};
