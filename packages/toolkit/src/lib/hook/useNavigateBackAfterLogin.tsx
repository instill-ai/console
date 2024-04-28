"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { env } from "../../server";

/**
 * This hook is used to navigate back to the current page after login
 * - caution: his function won't have effect on the console-ce edition
 */
export const useNavigateBackAfterLogin = () => {
  const router = useRouter();
  const pathname = usePathname();

  return React.useCallback(
    (path?: string) => {
      router.push(
        path
          ? `/api/auth/login?returnTo=${encodeURIComponent(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/${path}`)}`
          : `/api/auth/login?returnTo=${encodeURIComponent(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/${pathname}`)}`
      );
    },
    [pathname, router]
  );
};
