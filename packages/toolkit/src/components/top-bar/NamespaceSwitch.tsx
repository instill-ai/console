"use client";

import cn from "clsx";
import * as React from "react";

import {
  Icons,
  Select,
  Tag,
  Separator,
  Skeleton,
} from "@instill-ai/design-system";
import { useUserNamespaces } from "../../lib/useUserNamespaces";
import {
  InstillStore,
  Nullable,
  useAuthenticatedUser,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useNamespacesRemainingCredit,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { NamespaceAvatarWithFallback } from "../NamespaceAvatarWithFallback";
import { usePathname } from "next/navigation";

const truncateDisplayName = (value?: string) => {
  if (value && value.length >= 10) {
    return `${value?.slice(0, 10)}...`;
  }

  return value;
};

const selector = (store: InstillStore) => ({
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const NamespaceSwitch = () => {
  const {
    navigationNamespaceAnchor,
    updateNavigationNamespaceAnchor,
    accessToken,
    enabledQuery,
  } = useInstillStore(useShallow(selector));
  const [switchIsOpen, setSwitchIsOpen] = React.useState(false);
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

  const namespaces = useUserNamespaces();
  const pathname = usePathname();

  const namespaceNames = React.useMemo(() => {
    return namespaces.map((e) => e.name);
  }, [namespaces]);

  const namespacesRemainingCredit = useNamespacesRemainingCredit({
    namespaceNames,
    accessToken,
    enabled: enabledQuery,
  });

  const routeInfo = useRouteInfo();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const namespacesWithRemainingCredit = React.useMemo(() => {
    if (namespacesRemainingCredit.isSuccess) {
      return namespaces.map((namespace) => {
        return {
          ...namespace,
          remainingCredit:
            namespacesRemainingCredit.data.find(
              (e) => e.namespaceName === namespace.name,
            )?.remainingCredit.total ?? 0,
        };
      });
    }

    return [];
  }, [
    namespacesRemainingCredit.isSuccess,
    namespacesRemainingCredit.data,
    namespaces,
  ]);

  const selectedNamespace = React.useMemo(() => {
    if (!navigationNamespaceAnchor) {
      return null;
    }

    return namespacesWithRemainingCredit.length === 0
      ? namespaces.find((e) => e.id === navigationNamespaceAnchor) ?? null
      : namespacesWithRemainingCredit.find(
          (e) => e.id === navigationNamespaceAnchor,
        ) ?? null;
  }, [namespacesWithRemainingCredit, namespaces, navigationNamespaceAnchor]);

  // This is to deal with user entering their own setting page, we should
  // switch the namespace to the user's namespace
  React.useEffect(() => {
    if (routeInfo.isSuccess || !me.isSuccess) {
      return;
    }

    if (pathname.split("/")[1] === "settings") {
      updateNavigationNamespaceAnchor(() => me.data.id);
    }
  }, [
    routeInfo.isSuccess,
    pathname,
    me.isSuccess,
    me.data,
    updateNavigationNamespaceAnchor,
  ]);

  // This useEffect will deal with picking the initial namespace anchor
  // when the user enters the page
  React.useEffect(() => {
    let currentNamespaceId: Nullable<string> = null;
    let currentNamespaceType: Nullable<string> = null;

    if (routeInfo.isSuccess) {
      currentNamespaceId = routeInfo.data.namespaceId;
      currentNamespaceType = routeInfo.data.namespaceType;
    }

    if (!me.isSuccess) {
      return;
    }

    if (env("NEXT_PUBLIC_APP_ENV") === "CLOUD") {
      if (!namespacesRemainingCredit.isSuccess) {
        return;
      }

      let namespaceAnchor: Nullable<string> = navigationNamespaceAnchor;

      // If we don't have the namespace anchor, we will try to find the
      // namespace anchor based on the current namespace id and type

      if (!namespaceAnchor) {
        if (currentNamespaceId && currentNamespaceType) {
          if (
            currentNamespaceType === "NAMESPACE_USER" &&
            namespaces.findIndex((e) => e.id === currentNamespaceId) !== -1
          ) {
            namespaceAnchor = currentNamespaceId;
          } else if (
            currentNamespaceType === "NAMESPACE_ORGANIZATION" &&
            namespaces.findIndex((e) => e.id === currentNamespaceId) !== -1
          ) {
            namespaceAnchor = currentNamespaceId;
            // The user didn't have direct permission toward this resource
            // We will try to find the first namespace that the user has
          } else {
            namespaceAnchor = namespaces[0] ? namespaces[0].id : null;
          }
        } else {
          namespaceAnchor = me.data.id;
        }

        if (namespaceAnchor) {
          updateNavigationNamespaceAnchor(() => namespaceAnchor);
        }
      }
    } else {
      let namespaceAnchor: Nullable<string> = navigationNamespaceAnchor;

      if (!namespaceAnchor) {
        if (currentNamespaceId && currentNamespaceType) {
          if (
            currentNamespaceType === "NAMESPACE_USER" &&
            namespaces.findIndex((e) => e.id === currentNamespaceId) !== -1
          ) {
            namespaceAnchor = currentNamespaceId;
          } else if (
            currentNamespaceType === "NAMESPACE_ORGANIZATION" &&
            namespaces.findIndex((e) => e.id === currentNamespaceId) !== -1
          ) {
            namespaceAnchor = currentNamespaceId;
          } else {
            namespaceAnchor = namespaces[0] ? namespaces[0].id : null;
          }
        } else {
          namespaceAnchor = me.data.id;
        }

        if (namespaceAnchor) {
          updateNavigationNamespaceAnchor(() => namespaceAnchor);
        }
      }
    }
  }, [
    namespaces,
    navigationNamespaceAnchor,
    namespacesRemainingCredit.isSuccess,
    namespacesRemainingCredit.data,
    routeInfo.isSuccess,
    routeInfo.data,
    me.isSuccess,
    me.data,
    updateNavigationNamespaceAnchor,
  ]);

  return (
    <Select.Root
      value={selectedNamespace?.id ?? ""}
      onValueChange={(value) => {
        updateNavigationNamespaceAnchor(() => value);

        const pathnameArray = pathname.split("/");
        const targetNamespace = namespaces.find((e) => e.id === value);

        if (!routeInfo.isSuccess) {
          // When the user is in its personal setting page and then he switch to organization
          // namespace, we need to switch the page to the organization setting page

          if (
            targetNamespace &&
            pathnameArray[1] === "settings" &&
            targetNamespace.type === "organization"
          ) {
            navigate(`/${value}/organization-settings`);
            return;
          }
          return;
        }

        // When the current page is the organization setting page, and user switch
        // to another organization namespace, we need to switch the page to the org
        // namespace's setting page

        // If the switched namespace is a user, not org, then we need to redirect
        // the user to their own setting page

        if (
          routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION" &&
          pathnameArray[2] === "organization-settings"
        ) {
          if (targetNamespace && targetNamespace.type === "organization") {
            pathnameArray[1] = value;
            navigate(pathnameArray.join("/"));
            return;
          }

          if (targetNamespace && targetNamespace.type === "user") {
            navigate(`/settings`);
            return;
          }
        }

        // When the current page is user/org profile page and user switch to
        // other namespaces, we need to switch the page to the new namespace's
        // profile page

        if (pathnameArray.length === 2 && pathnameArray[1] !== "hub") {
          pathnameArray[1] = value;
          navigate(pathnameArray.join("/"));
          return;
        }

        // When the user is in regular namespace page, we need to switch the page
        // to the new namespace
        if (
          (pathnameArray[2] === "pipelines" ||
            pathnameArray[2] === "models" ||
            pathnameArray[2] === "dashboard") &&
          pathnameArray.length === 3
        ) {
          pathnameArray[1] = value;
          navigate(pathnameArray.join("/"));
          return;
        }
      }}
      open={switchIsOpen}
      onOpenChange={(value) => {
        setSwitchIsOpen(value);
      }}
      disabled={namespacesRemainingCredit.isSuccess ? false : true}
    >
      <Select.Trigger
        icon={<React.Fragment />}
        className={cn(
          "!w-[136px] !border-none !p-1 hover:!bg-semantic-bg-secondary",
          switchIsOpen
            ? "!bg-semantic-bg-secondary"
            : "!bg-semantic-bg-primary",
        )}
      >
        {selectedNamespace ? (
          // We force the Select.Value to re-render when the selectedNamespace changes
          // to update the image of the Select.Value
          <Select.Value>
            <div
              key={selectedNamespace.id}
              className="flex w-[128px] flex-row items-center justify-between gap-x-2"
            >
              <div className="flex w-full flex-row items-center gap-x-2">
                <NamespaceAvatarWithFallback.Root
                  src={selectedNamespace.avatarUrl ?? null}
                  className="h-8 w-8"
                  fallback={
                    <NamespaceAvatarWithFallback.Fallback
                      namespaceId={selectedNamespace.id}
                      displayName={selectedNamespace.displayName}
                      className="h-8 w-8"
                    />
                  }
                />

                <p className="line-clamp-1 break-all text-semantic-fg-primary product-body-text-3-medium">
                  {truncateDisplayName(selectedNamespace.id)}
                </p>
              </div>

              <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-primary" />
            </div>
          </Select.Value>
        ) : (
          <div className="flex w-[128px] flex-row items-center gap-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        )}
      </Select.Trigger>
      <Select.Content viewportClassName="!p-0" className="!w-[255px] !p-0">
        <div className="flex flex-col">
          <div className="flex flex-col px-2 py-3">
            {namespacesWithRemainingCredit
              ? namespacesWithRemainingCredit.map((namespace) => {
                  return (
                    <Select.Item
                      className="!px-2.5 !py-1 hover:bg-semantic-bg-base-bg data-[highlighted]:!bg-semantic-bg-base-bg data-[highlighted]:!stroke-semantic-fg-primary"
                      tailCheck={true}
                      value={namespace.id}
                      key={namespace.id}
                    >
                      <div className="flex flex-row items-center gap-x-3">
                        <NamespaceAvatarWithFallback.Root
                          src={namespace.avatarUrl ?? null}
                          className="h-10 w-10 rounded-full"
                          fallback={
                            <NamespaceAvatarWithFallback.Fallback
                              namespaceId={namespace.id}
                              displayName={namespace.displayName}
                              className="h-10 w-10"
                            />
                          }
                        />
                        <div className="flex flex-col">
                          <p className="text-semantic-fg-primary product-body-text-3-medium">
                            {namespace.id}
                          </p>
                          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
                            <Tag
                              className="flex flex-row gap-x-1"
                              variant="lightBlue"
                              size="sm"
                            >
                              <Icons.Coins01 className="h-2.5 w-2.5 stroke-semantic-accent-default" />
                              {`${namespace.remainingCredit.toLocaleString("en-US", { style: "decimal" })} credits left`}
                            </Tag>
                          ) : null}
                        </div>
                      </div>
                    </Select.Item>
                  );
                })
              : null}
          </div>
          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
            <React.Fragment>
              <Separator orientation="horizontal" />
              <div className="w-full p-1.5">
                <button
                  onClick={() => {
                    navigate("/settings/organizations/new");
                  }}
                  className="w-full cursor-pointer p-2.5 product-body-text-3-medium hover:bg-semantic-bg-base-bg hover:!text-black"
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <Icons.Plus className="h-4 w-4 stroke-semantic-fg-disabled" />
                    <p className="mr-0.5">Create Organization</p>
                  </div>
                </button>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </Select.Content>
    </Select.Root>
  );
};
