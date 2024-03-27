"use client";

import cn from "clsx";
import Link from "next/link";
import React, { ReactElement } from "react";
import { Icons } from "@instill-ai/design-system";
import { TopbarLink } from "./TopbarLink";
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

const topbarItems = [
  {
    pathName: "pipelines",
    icon: <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />,
    name: "Pipelines",
  },
  {
    pathName: "connectors",
    icon: (
      <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
    ),
    name: "Connectors",
  },
  {
    pathName: "models",
    icon: <Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />,
    name: "Model Hub",
  },
  {
    pathName: "dashboard",
    icon: (
      <Icons.BarChartSquare02 className="h-6 w-6 stroke-semantic-fg-primary" />
    ),
    name: "Dashboard",
  },
];

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
  const pathName = usePathname();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <div className="flex w-full border-b border-semantic-bg-line px-8">
      <div
        className={cn(
          "box-content flex h-[var(--topbar-height)] w-full flex-row bg-semantic-bg-primary",
          className
        )}
      >
        <Link href="/" className="my-auto pr-8">
          {logo}
        </Link>

        {children ? (
          <div className="flex w-full flex-1 flex-row">{children}</div>
        ) : (
          <React.Fragment>
            {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
              <TopbarLink
                key="hub"
                href="/hub"
                icon={
                  <Icons.CubeOutline className="h-6 w-6 stroke-semantic-fg-primary" />
                }
                name="Hub"
                hightlighted={pathName.split("/")[1] === "hub"}
                className="mx-1 my-2 px-4"
              />
            ) : null}
            {topbarItems.map(({ pathName, name, icon }) => (
              <TopbarLink
                key={pathName}
                href={`/${me.data?.id}/${pathName}`}
                icon={icon}
                name={name}
                hightlighted={pathName.split("/")[2] === pathName}
                className="mx-1 my-2 px-4"
              />
            ))}
          </React.Fragment>
        )}
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
