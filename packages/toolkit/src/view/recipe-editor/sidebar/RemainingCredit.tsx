"use client";

import * as React from "react";

import { Icons, Tag } from "@instill-ai/design-system";

import { NamespaceAvatarWithFallback } from "../../../components";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useOrganization,
  useRemainingCredit,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import { env } from "../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const RemainingCredit = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const me = useAuthenticatedUser({
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      routeInfo.data.namespaceType === "NAMESPACE_USER",
    accessToken,
  });

  const organization = useOrganization({
    organizationId: routeInfo.data.namespaceId,
    accessToken,
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION",
  });

  const remainingCredit = useRemainingCredit({
    ownerName: routeInfo.data.namespaceName,
    accessToken,
    enabled: enabledQuery && env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
  });

  const avatar = React.useMemo(() => {
    if (!routeInfo.isSuccess) {
      return;
    }

    if (routeInfo.data.namespaceType === "NAMESPACE_USER" && me.isSuccess) {
      return (
        <NamespaceAvatarWithFallback.Root
          src={me.data.profile?.avatar ?? null}
          className="my-auto h-8 w-8 cursor-pointer"
          fallback={
            <NamespaceAvatarWithFallback.Fallback
              namespaceId={me.data.id}
              displayName={me.data.profile?.displayName ?? null}
              className="h-8 w-8"
            />
          }
        />
      );
    }

    if (
      routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION" &&
      organization.isSuccess
    ) {
      return (
        <NamespaceAvatarWithFallback.Root
          src={organization.data.profile?.avatar ?? null}
          className="my-auto h-8 w-8 cursor-pointer"
          fallback={
            <NamespaceAvatarWithFallback.Fallback
              namespaceId={organization.data.id}
              displayName={organization.data.profile?.displayName ?? null}
              className="h-8 w-8"
            />
          }
        />
      );
    }
  }, [
    routeInfo.data,
    routeInfo.isSuccess,
    me.isSuccess,
    organization.isSuccess,
    me.data,
    organization.data,
  ]);

  return (
    <div className="flex flex-row px-4 py-3 gap-x-3">
      {avatar}
      <div className="flex flex-col">
        <p className="product-body-text-3-medium text-semantic-fg-primary">
          {routeInfo.data.namespaceId}
        </p>
        <Tag className="flex flex-row gap-x-1" variant="lightBlue" size="sm">
          <Icons.Coins01 className="h-2.5 w-2.5 stroke-semantic-accent-default" />
          {`${remainingCredit.data?.total.toLocaleString("en-US", {
            style: "decimal",
          })} credits left`}
        </Tag>
      </div>
    </div>
  );
};
