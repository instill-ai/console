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
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      onError={() => {
        setError(true);
        console.error(error);
      }}
      className="flex-shrink-0"
    />
  );
};
