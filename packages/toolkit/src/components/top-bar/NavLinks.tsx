"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import cn from "clsx";

import { Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";
import { useUserNamespaces } from "../../lib/useUserNamespaces";
import { env } from "../../server";

export type NavLinkProps = {
  title: string;
  Icon: React.ElementType;
  pathname: string;
  strict?: boolean;
  isExploreRoute?: boolean;
};

const navLinkItems: NavLinkProps[] = [
  {
    pathname: "pipelines",
    Icon: Icons.Pipeline,
    title: "Pipelines",
    strict: true,
  },
  {
    pathname: "models",
    Icon: Icons.Cube01,
    title: "Models",
    strict: true,
  },
  {
    pathname: "catalog",
    Icon: Icons.Database01,
    title: "Artifacts",
  },
  {
    pathname: "dashboard",
    Icon: Icons.BarChartSquare02,
    title: "Dashboard",
  },
  {
    pathname: "agents",
    Icon: Icons.CubeOutline,
    title: "Chat",
  },
];

const navLinkSelector = (store: InstillStore) => ({
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const NavLink = ({
  title,
  Icon,
  pathname,
  strict,
  isExploreRoute,
}: NavLinkProps) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const { navigationNamespaceAnchor } = useInstillStore(
    useShallow(navLinkSelector),
  );

  const isOnIt = React.useMemo(() => {
    if (isExploreRoute) {
      return false;
    }

    if (strict) {
      return currentPathname.split("/")[2] === pathname;
    } else {
      return currentPathname.includes(pathname);
    }
  }, [pathname, currentPathname, strict, isExploreRoute]);

  const userNamespaces = useUserNamespaces();

  const namespaceAnchor = React.useMemo(() => {
    if (!userNamespaces.isSuccess) {
      return null;
    }

    if (!navigationNamespaceAnchor) {
      const userNamespace = userNamespaces.data.find(
        (namespace) => namespace.type === "user",
      );

      if (userNamespace) {
        return userNamespace.id;
      }
    }

    return navigationNamespaceAnchor;
  }, [
    userNamespaces.isSuccess,
    userNamespaces.data,
    navigationNamespaceAnchor,
  ]);

  return (
    <button
      onClick={() => {
        if (!namespaceAnchor) {
          return;
        }

        router.push(`/${namespaceAnchor}/${pathname}`);
      }}
      className={cn(
        "group flex h-10 flex-row gap-x-2 border-b-2 border-[#316FED] py-3 product-button-button-1 hover:text-semantic-accent-default",
        isOnIt
          ? "border-opacity-100 text-semantic-fg-primary"
          : "border-opacity-0 text-semantic-fg-disabled",
      )}
    >
      <Icon className="h-5 w-5 stroke-semantic-fg-disabled group-hover:stroke-semantic-accent-default" />
      {title}
    </button>
  );
};

const navLinksSelector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const NavLinks = ({ isExploreRoute }: { isExploreRoute?: boolean }) => {
  const { accessToken, enabledQuery } = useInstillStore(
    useShallow(navLinksSelector),
  );
  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <React.Fragment>
      {me.isSuccess
        ? navLinkItems
            .filter((item) => {
              if (env("NEXT_PUBLIC_APP_ENV") === "CLOUD") {
                return true;
              } else {
                return item.pathname !== "agents";
              }
            })
            .map(({ pathname, Icon, title }) => (
              <NavLink
                key={pathname}
                pathname={pathname}
                Icon={Icon}
                title={title}
                isExploreRoute={isExploreRoute}
                strict={true}
              />
            ))
        : null}
    </React.Fragment>
  );
};
