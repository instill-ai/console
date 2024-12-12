import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { cn, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useShallow,
  useUserNamespaces,
} from "../../lib";

export type SidebarNavLinkProps = {
  title: string;
  iconName: keyof typeof Icons;
  pathname: string;
  strict?: boolean;
  isExploreRoute?: boolean;
};

const navLinkSelector = (store: InstillStore) => ({
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const SidebarNavLink = ({
  title,
  iconName,
  pathname,
  strict,
  isExploreRoute,
}: SidebarNavLinkProps) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const { navigationNamespaceAnchor } = useInstillStore(
    useShallow(navLinkSelector),
  );

  const Icon = Icons[iconName];

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
        "flex h-8 flex-row items-center gap-x-2 px-2 text-xs text-semantic-fg-secondary font-medium rounded hover:bg-semantic-bg-line",
        isOnIt ? "bg-semantic-bg-line" : "",
      )}
    >
      <Icon className="h-3.5 w-3.5 stroke-semantic-fg-disabled" />
      {title}
    </button>
  );
};
