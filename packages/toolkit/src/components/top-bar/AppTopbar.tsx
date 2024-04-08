"use client";

import cn from "clsx";
import React, { ReactElement } from "react";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";
import { CloudTopbarDropdown } from "./CloudTopbarDropdown";
import { CETopbarDropdown } from "./CETopbarDropdown";
import { env } from "../../server";
import { usePathname, useRouter } from "next/navigation";
import { TopbarLinks } from "./TopbarLinks";
import { useGuardUnsavedChangesNavigation } from "../../lib/hook";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const AppTopbar = ({
  logo,
  children,
  className,
  disabledUserDropdown,
}: {
  logo: ReactElement;
  children?: React.ReactNode;
  className?: string;
  disabledUserDropdown?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const navigate = useGuardUnsavedChangesNavigation();

  return (
    <div className="flex w-full border-b border-semantic-bg-line px-8">
      <div
        className={cn(
          "box-content flex h-[var(--topbar-height)] w-full flex-row bg-semantic-bg-primary",
          className
        )}
      >
        <button
          className="my-auto pr-8"
          onClick={() => {
            navigate("/hub");
          }}
        >
          {logo}
        </button>

        {children ? (
          <div className="flex w-full flex-1 flex-row">{children}</div>
        ) : me.isSuccess ? (
          <TopbarLinks entity={me.data.id} pathname={pathname} />
        ) : null}
      </div>

      {disabledUserDropdown ? null : (
        <div className="ml-4 flex">
          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
            <CloudTopbarDropdown router={router} />
          ) : (
            <CETopbarDropdown router={router} />
          )}
        </div>
      )}
    </div>
  );
};
