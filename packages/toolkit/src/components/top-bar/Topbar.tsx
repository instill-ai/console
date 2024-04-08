"use client";

import cn from "clsx";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { DropdownMenu } from "@instill-ai/design-system";
import {
  InstillStore,
  useAuthenticatedUser,
  useGuardUnsavedChangesNavigation,
  useInstillStore,
  useShallow,
} from "../../lib";
import { CloudTopbarDropdown } from "./CloudTopbarDropdown";
import { CETopbarDropdown } from "./CETopbarDropdown";
import { env } from "../../server";
import { TopbarLinks } from "./TopbarLinks";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Topbar = ({
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
        ) : (
          <React.Fragment>
            {me.isSuccess ? (
              <TopbarLinks pathname={router.pathname} entity={me.data.id} />
            ) : null}
          </React.Fragment>
        )}
      </div>

      {disabledUserDropdown ? null : (
        <div className="ml-4 flex">
          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
            <CloudTopbarDropdown />
          ) : (
            <CETopbarDropdown />
          )}
        </div>
      )}
    </div>
  );
};

export const TopbarDropdownItem = ({
  children,
  asChild,
  onClick,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}) => {
  return (
    <DropdownMenu.Item
      asChild={asChild}
      className="cursor-pointer !gap-x-2 !px-2.5 !py-[9px] !product-body-text-3-medium hover:!bg-semantic-bg-base-bg hover:!text-black"
      onClick={onClick}
    >
      {children}
    </DropdownMenu.Item>
  );
};

export const TopbarDropdownGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <DropdownMenu.Group className="!p-1.5">{children}</DropdownMenu.Group>;
};
