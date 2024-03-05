import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { DropdownMenu, Icons } from "@instill-ai/design-system";
import { TopbarLink } from "./TopbarLink";
import {
  InstillStore,
  env,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";
import { CloudTopbarDropdown } from "./CloudTopbarDropdown";
import { CETopbarDropdown } from "./CETopbarDropdown";

export const ceTopbarItems = [
  {
    pathName: "pipelines",
    Icon: Icons.Pipeline,
    name: "Pipelines",
  },
  {
    pathName: "connectors",
    Icon: Icons.IntersectSquare,
    name: "Connectors",
  },
  {
    pathName: "models",
    Icon: Icons.Cube01,
    name: "Model Hub",
  },
  {
    pathName: "dashboard",
    Icon: Icons.BarChartSquare02,
    name: "Dashboard",
  },
];

export const cloudTopbarItems = [
  {
    pathName: "hub",
    Icon: Icons.CubeOutline,
    name: "Hub",
  },
  {
    pathName: "pipelines",
    Icon: Icons.Pipeline,
    name: "Pipelines",
  },
  {
    pathName: "connectors",
    Icon: Icons.IntersectSquare,
    name: "Connectors",
  },
  {
    pathName: "models",
    Icon: Icons.Cube01,
    name: "Model Hub",
  },
  {
    pathName: "dashboard",
    Icon: Icons.BarChartSquare02,
    name: "Dashboard",
  },
];

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
            {me.isSuccess ? (
              <React.Fragment>
                {env("NEXT_PUBLIC_APP_ENV") === "CLOUD"
                  ? cloudTopbarItems.map(({ pathName, name, Icon }) => (
                      <TopbarLink
                        key={pathName}
                        href={`/${me.data.id}/${pathName}`}
                        icon={
                          <Icon className="h-6 w-6 stroke-semantic-fg-primary" />
                        }
                        name={name}
                        hightlighted={
                          router.pathname.split("/")[2] === pathName
                        }
                        className="mx-1 my-2 px-4"
                      />
                    ))
                  : ceTopbarItems.map(({ pathName, name, Icon }) => (
                      <TopbarLink
                        key={pathName}
                        href={`/${me.data.id}/${pathName}`}
                        icon={
                          <Icon className="h-6 w-6 stroke-semantic-fg-primary" />
                        }
                        name={name}
                        hightlighted={
                          router.pathname.split("/")[2] === pathName
                        }
                        className="mx-1 my-2 px-4"
                      />
                    ))}
              </React.Fragment>
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
