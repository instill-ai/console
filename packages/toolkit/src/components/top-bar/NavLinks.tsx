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

export type NavLinkProps = {
  title: string;
  Icon: React.ElementType;
  pathname: string;
};

const navLinkItems: NavLinkProps[] = [
  {
    pathname: "pipelines",
    Icon: Icons.Pipeline,
    title: "Pipelines",
  },
  {
    pathname: "models",
    Icon: Icons.Cube01,
    title: "Models",
  },
  {
    pathname: "dashboard",
    Icon: Icons.BarChartSquare02,
    title: "Dashboard",
  },
];

const navLinkSelector = (store: InstillStore) => ({
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const NavLink = ({ title, Icon, pathname }: NavLinkProps) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const { navigationNamespaceAnchor } = useInstillStore(
    useShallow(navLinkSelector),
  );

  const isOnIt = React.useMemo(() => {
    if (currentPathname.split("/")[2] === pathname) {
      return true;
    }
    return false;
  }, [pathname, currentPathname]);

  const namespaces = useUserNamespaces();

  const namespaceAnchor = React.useMemo(() => {
    if (!navigationNamespaceAnchor) {
      const userNamespace = namespaces.find(
        (namespace) => namespace.type === "user",
      );

      if (userNamespace) {
        return userNamespace.id;
      }
    }

    return navigationNamespaceAnchor;
  }, [namespaces, navigationNamespaceAnchor]);

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

export const NavLinks = () => {
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
        ? navLinkItems.map(({ pathname, Icon, title }) => (
            <NavLink
              key={pathname}
              pathname={pathname}
              Icon={Icon}
              title={title}
            />
          ))
        : null}
    </React.Fragment>
  );
};
