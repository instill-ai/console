"use client";

import * as React from "react";
import cn from "clsx";
import { Nullable } from "../lib";

export const EntityAvatar = ({
  src,
  entityName,
  className,
  fallbackImg,
}: {
  entityName: string;
  src: Nullable<string>;
  className: string;
  fallbackImg: React.ReactElement;
}) => {
  const [error, setError] = React.useState(false);

  if (!src) {
    return fallbackImg;
  }

  return error ? (
    fallbackImg
  ) : (
    <img
      src={src}
      alt={`Avatar of ${entityName}`}
      onError={() => {
        setError(true);
      }}
      className={cn("shrink-0 grow-0 rounded-full object-contain", className)}
    />
  );
};
