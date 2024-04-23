"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * This hook is used to navigate back to the current page after login
 * - caution: his function won't have effect on the console-ce edition
 */
export const useNavigateBackAfterLogin = () => {
  const router = useRouter();
  const pathname = usePathname();

  return React.useCallback(() => {
    router.push(`/api/auth/login?returnTo=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);
};
