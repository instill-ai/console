"use client";

import { Icons } from "@instill-ai/design-system";
import cn from "clsx";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useUserNamespaces } from "../../lib/useUserNamespaces";
import { InstillStore, useInstillStore, useShallow } from "../../lib";
import { env } from "../../server";

export type NavLinkProps = {
  title: string;
  Icon: React.ElementType;
  pathname: string;
};

const navLinkItems: NavLinkProps[] = [
  {
    pathname: "hub",
    Icon: Icons.CubeOutline,
    title: "Hub",
  },
  {
    pathname: "pipelines",
    Icon: Icons.Pipeline,
    title: "Pipelines",
  },

  {
    pathname: "knowledge",
    Icon: Icons.GraduationHat,
    title: "Knowledge base",
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

const selector = (store: InstillStore) => ({
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const NavLink = ({ title, Icon, pathname }: NavLinkProps) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const { navigationNamespaceAnchor } = useInstillStore(useShallow(selector));

  const isOnIt = React.useMemo(() => {
    console.log("currentPathname", currentPathname, pathname);
    if (pathname === "hub" && currentPathname.split("/")[1] === pathname) {
      return true;
    }

    if (currentPathname.split("/")[2] === pathname) {
      return true;
    }
    return false;
  }, [pathname, currentPathname]);

  const namespaces = useUserNamespaces();

  const namespaceAnchor = React.useMemo(() => {
    if (!navigationNamespaceAnchor) {
      const userNamespace = namespaces.find(
        (namespace) => namespace.type === "user"
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

        if (pathname === "hub") {
          router.push("/hub");
          return;
        }

        router.push(`/${namespaceAnchor}/${pathname}`);
      }}
      className={cn(
        "group flex flex-row gap-x-2 border-b-2 border-[#316FED] py-3 product-button-button-1 hover:text-semantic-accent-default",
        isOnIt
          ? "border-opacity-100 text-semantic-fg-primary"
          : "border-opacity-0 text-semantic-fg-disabled"
      )}
    >
      <Icon className="h-5 w-5 stroke-semantic-fg-disabled group-hover:stroke-semantic-accent-default" />
      {title}
    </button>
  );
};

export const NavLinks = () => {
  return (
    <React.Fragment>
      {navLinkItems
        .filter((item) => {
          if (env("NEXT_PUBLIC_APP_ENV") === "CE") {
            return item.pathname !== "hub";
          }
        })
        .map(({ pathname, Icon, title }) => (
          <NavLink
            key={pathname}
            pathname={pathname}
            Icon={Icon}
            title={title}
          />
        ))}
    </React.Fragment>
  );
};
