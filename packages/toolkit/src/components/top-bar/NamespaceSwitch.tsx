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
  useOrganization,
  useRouteInfo,
  useShallow,
  useUser,
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

  const user = useUser({
    userName: routeInfo.data.namespaceName,
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      routeInfo.data.namespaceType === "NAMESPACE_USER",
    accessToken,
  });

  const organization = useOrganization({
    organizationID: routeInfo.data.namespaceId,
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION",
    accessToken,
  });

  const namespacesWithRemainingCredit = React.useMemo(() => {
    if (namespacesRemainingCredit.isSuccess) {
      return namespaces.map((namespace) => {
        return {
          ...namespace,
          remainingCredit:
            namespacesRemainingCredit.data.find(
              (e) => e.namespaceName === namespace.name
            )?.remainingCredit ?? 0,
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
    return (
      namespacesWithRemainingCredit.find(
        (e) => e.id === navigationNamespaceAnchor
      ) ?? null
    );
  }, [namespacesWithRemainingCredit, navigationNamespaceAnchor]);

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
          if (currentNamespaceType === "NAMESPACE_USER" && user.isSuccess) {
            namespaceAnchor = user.data.id;
          }

          if (
            currentNamespaceType === "NAMESPACE_ORGANIZATION" &&
            organization.isSuccess
          ) {
            namespaceAnchor = organization.data.id;
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
          if (currentNamespaceType === "NAMESPACE_USER" && user.isSuccess) {
            namespaceAnchor = user.data.id;
          }

          if (
            currentNamespaceType === "NAMESPACE_ORGANIZATION" &&
            organization.isSuccess
          ) {
            namespaceAnchor = organization.data.id;
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
    organization.isSuccess,
    organization.data,
    user.isSuccess,
    user.data,
    updateNavigationNamespaceAnchor,
  ]);

  return (
    <Select.Root
      value={navigationNamespaceAnchor ?? ""}
      onValueChange={(value) => {
        updateNavigationNamespaceAnchor(() => value);

        if (!routeInfo.isSuccess) {
          return;
        }

        const pathnameArray = pathname.split("/");

        // When the current page is the organizatino setting page, and user switch
        // to another organizatino namespace, we need to switch the page too
        if (routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION") {
          if (pathnameArray[2] === "organization-settings") {
            pathnameArray[1] = value;
            navigate(pathnameArray.join("/"));
            return;
          }
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

        // When the user is in its personal setting page and then he switch to organization
        // namespace, we need to switch the page to the organization setting page
        const targetNamespace = namespaces.find((e) => e.id === value);

        if (
          targetNamespace &&
          pathnameArray[1] === "settings" &&
          targetNamespace.type === "organization"
        ) {
          navigate(`/${value}/organization-settings`);
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
        icon={
          <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-primary" />
        }
        className={cn(
          "!w-[150px] !border-none  hover:!bg-semantic-bg-secondary",
          switchIsOpen ? "!bg-semantic-bg-secondary" : "!bg-semantic-bg-primary"
        )}
      >
        <Select.Value asChild>
          {selectedNamespace ? (
            <div className="flex flex-row items-center gap-x-2">
              <NamespaceAvatarWithFallback.Root
                src={selectedNamespace.avatarUrl ?? null}
                className="h-8 w-8 rounded-full"
                fallback={
                  <NamespaceAvatarWithFallback.Fallback
                    namespaceId={selectedNamespace.id}
                    displayName={selectedNamespace.displayName}
                  />
                }
              />

              <p className="line-clamp-1 text-semantic-fg-primary product-body-text-3-medium">
                {truncateDisplayName(selectedNamespace.id)}
              </p>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          )}
        </Select.Value>
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
                              className="!h-10 !w-10"
                            />
                          }
                        />

                        <div className="flex flex-col">
                          <p className="text-semantic-fg-primary product-body-text-3-medium">
                            {namespace.id}
                          </p>
                          {namespace.remainingCredit ? (
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
