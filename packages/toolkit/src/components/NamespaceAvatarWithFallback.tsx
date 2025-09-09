"use client";

import * as React from "react";
import cn from "clsx";

import { getCapitalizeTwoWordsFromName, Nullable } from "../lib";

export const NamespaceAvatarWithFallbackRoot = ({
  src,
  className,
  fallback,
  refreshKey,
}: {
  src: Nullable<string>;
  className: string;
  fallback: React.ReactElement;
  refreshKey?: string | null;
}) => {
  const [error, setError] = React.useState(false);
  const [objectUrl, setObjectUrl] = React.useState<Nullable<string>>(null);

  // Reset error state when src changes to allow re-attempt rendering a new image
  React.useEffect(() => {
    setError(false);
  }, [src, refreshKey]);

  // Ensure latest image is fetched and rendered
  // - This effect runs whenever `src` or `refreshKey` changes. We explicitly
  //   refetch the image with cache control so the newest bytes are used.
  // - The cleanup (the function we return) sets `cancelled = true` so that any
  //   in-flight async work will NOT call setState after unmount or before a
  //   newer effect runs. This avoids setting state on an unmounted component
  //   and prevents race conditions where an older fetch overwrites newer state.
  // - We always revoke the previous object URL using the functional updater
  //   form of setState: `setObjectUrl(prev => { if (prev) URL.revokeObjectURL(prev); ... })`.
  //   React passes the latest state as `prev`, so we never rely on a stale
  //   closure. `prev` here is Nullable<string>: it is a blob URL string (truthy)
  //   when one exists, otherwise null (falsy). We only revoke when `prev` is set.
  // - `refreshKey` lets callers force a refetch even if `src` (the URL string)
  //   stays the same (e.g., using a user `updateTime`).
  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!src) {
        // Cleanup previous object URL if any
        setObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        return;
      }

      try {
        const response = await fetch(src, { method: "GET", cache: "reload" });
        if (!response.ok) {
          throw new Error("Failed to fetch avatar image");
        }
        const blob = await response.blob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      setObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [src, refreshKey]);

  if (!src) {
    return fallback;
  }

  return error ? (
    fallback
  ) : (
    <img
      src={objectUrl ?? src ?? undefined}
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
  className: string;
  textClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "flex shrink-0 grow-0 items-center justify-center rounded-full bg-semantic-bg-line",
        className,
      )}
    >
      <p
        className={cn(
          "font-sans text-[11px] font-semibold text-semantic-fg-secondary",
          textClassName,
        )}
      >
        {displayName && displayName !== "" && displayName !== " "
          ? getCapitalizeTwoWordsFromName(displayName)
          : getCapitalizeTwoWordsFromName(namespaceId)}
      </p>
    </div>
  );
};

export const NamespaceAvatarWithFallback = {
  Root: NamespaceAvatarWithFallbackRoot,
  Fallback: NamespaceAvatarWithFallbackFallback,
};
