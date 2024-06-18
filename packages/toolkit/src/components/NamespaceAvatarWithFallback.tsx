"use client";

import * as React from "react";
import cn from "clsx";
import { Nullable, getCaptializeTwoWordsFromName } from "../lib";

export const NamespaceAvatarWithFallbackRoot = ({
  src,
  className,
  fallback,
}: {
  src: Nullable<string>;
  className: string;
  fallback: React.ReactElement;
}) => {
  const [error, setError] = React.useState(false);

  if (!src) {
    return fallback;
  }

  return error ? (
    fallback
  ) : (
    <img
      src={src}
      alt="Current namespace avatar"
      onError={() => {
        setError(true);
      }}
      className={cn("shrink-0 grow-0 rounded-full object-cover", className)}
    />
  );
};

export const NamespaceAvatarWithFallbackFallback = ({
  namespaceId,
  displayName,
  className,
  textClassName,
}: {
  namespaceId: string;
  displayName: Nullable<string>;
  className?: string;
  textClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 grow-0 items-center justify-center rounded-full bg-semantic-bg-line",
        className
      )}
    >
      <p
        className={cn(
          "font-sans text-[11px] font-semibold text-semantic-fg-secondary",
          textClassName
        )}
      >
        {displayName && displayName !== "" && displayName !== " "
          ? getCaptializeTwoWordsFromName(displayName)
          : getCaptializeTwoWordsFromName(namespaceId)}
      </p>
    </div>
  );
};

export const NamespaceAvatarWithFallback = {
  Root: NamespaceAvatarWithFallbackRoot,
  Fallback: NamespaceAvatarWithFallbackFallback,
};
