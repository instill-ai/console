import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";
import { NamespaceSwitch } from "../top-bar";
import { SidebarNavLink, SidebarNavLinkProps } from "./SidebarNavLink";

const navLinkItems: SidebarNavLinkProps[] = [
  {
    pathname: "dashboard",
    iconName: "BarChartSquare02",
    title: "Dashboard",
  },
  {
    pathname: "catalog",
    iconName: "Database01",
    title: "Artifacts",
  },
  {
    pathname: "pipelines",
    iconName: "Pipeline",
    title: "Pipelines",
    strict: true,
  },
  {
    pathname: "models",
    iconName: "Cube01",
    title: "Models",
    strict: true,
  },
  /*{
    pathname: "applications",
    iconName: "Browser",
    title: "Applications",
  },*/
];

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const SidebarNav = ({
  namespaceSwitch,
}: {
  namespaceSwitch?: React.ReactNode;
}) => {
  const router = useRouter();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  return me.isSuccess ? (
    <div className="flex flex-col gap-y-2 p-3">
      {me.isSuccess ? (
        (namespaceSwitch ?? <NamespaceSwitch />)
      ) : (
        <Button
          onClick={() => {
            router.push("/api/auth/login");
          }}
          variant="secondaryColour"
          className="!my-auto"
          size="md"
        >
          Log In
        </Button>
      )}
      {navLinkItems.map(({ pathname, iconName, title, strict }) => (
        <SidebarNavLink
          key={pathname}
          pathname={pathname}
          iconName={iconName}
          title={title}
          //isExploreRoute={isExploreRoute}
          strict={strict}
        />
      ))}
    </div>
  ) : null;
};
