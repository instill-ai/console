"use client";

import * as React from "react";
import { Integration, IntegrationConnection } from "instill-sdk";

import { Icons, Input, Nullable, Skeleton } from "@instill-ai/design-system";

import {
  debounce,
  InstillStore,
  useAuthenticatedUser,
  useInfiniteIntegrationConnections,
  useInfiniteIntegrations,
  useInstillStore,
  useShallow,
  useUserNamespaces,
} from "../../../lib";
import { ConnectableIntegration } from "./connectable-integration";
import { ExistingConnection } from "./existing-connection/ExistingConnection";
import { Section } from "./Section";

const selector = (store: InstillStore) => ({
  enabledQuery: store.enabledQuery,
  accessToken: store.accessToken,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const Integrations = () => {
  const { enabledQuery, accessToken, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    accessToken: accessToken,
    enabled: enabledQuery,
  });

  const userNamespaces = useUserNamespaces();

  const selectedNamespaceId = React.useMemo(() => {
    if (
      !navigationNamespaceAnchor ||
      !userNamespaces.isSuccess ||
      !me.isSuccess
    ) {
      return null;
    }

    if (userNamespaces.data.length === 0) {
      return me.data.id;
    }

    return (
      userNamespaces.data.find((e) => e.id === navigationNamespaceAnchor)?.id ??
      null
    );
  }, [
    userNamespaces.isSuccess,
    userNamespaces.data,
    navigationNamespaceAnchor,
    me.isSuccess,
    me.data,
  ]);

  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
  const debouncedSetSearchValue = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchInputValue(value);
      }, 500),
    [],
  );

  const availableIntegrations = useInfiniteIntegrations({
    accessToken,
    enabled: enabledQuery,
    filter: searchInputValue ? `qIntegration="${searchInputValue}"` : null,
  });

  const integrationConnections = useInfiniteIntegrationConnections({
    namespaceId: selectedNamespaceId,
    accessToken,
    enabled: enabledQuery && me.isSuccess,
    filter: searchInputValue ? `qConnection="${searchInputValue}"` : null,
  });

  React.useEffect(() => {
    if (availableIntegrations.isSuccess) {
      if (
        availableIntegrations.data.pages[
          availableIntegrations.data.pages.length - 1
        ]?.nextPageToken
      ) {
        availableIntegrations.fetchNextPage();
      }
    }

    if (integrationConnections.isSuccess) {
      if (
        integrationConnections.data.pages[
          integrationConnections.data.pages.length - 1
        ]?.nextPageToken
      ) {
        integrationConnections.fetchNextPage();
      }
    }
  }, [
    availableIntegrations.isSuccess,
    availableIntegrations.data,
    integrationConnections.isSuccess,
    integrationConnections.data,
  ]);

  const availableIntegrationList = React.useMemo(() => {
    const integrations: Integration[] = [];

    if (!availableIntegrations.isSuccess) {
      return integrations;
    }

    for (const page of availableIntegrations.data.pages) {
      for (const integration of page.integrations) {
        integrations.push(integration);
      }
    }
    // Uncomment the following line to sort the integrations by title
    // integrations.sort((a, b) => a.title.localeCompare(b.title));
    return integrations;
  }, [availableIntegrations.isSuccess, availableIntegrations.data]);

  const integrationConnectionList = React.useMemo(() => {
    const dic: Record<string, IntegrationConnection[]> = {};
    const list: {
      integration: Integration;
      connections: IntegrationConnection[];
    }[] = [];

    if (integrationConnections.isSuccess) {
      integrationConnections.data?.pages.forEach((page) => {
        page.connections.forEach((connection) => {
          if (!dic[connection.integrationId]) {
            dic[connection.integrationId] = [];
          }

          dic[connection.integrationId]?.push(connection);
        });
      });
    }

    Object.keys(dic).forEach((integrationId) => {
      const integration = availableIntegrationList.find(
        (item) => item.id === integrationId,
      );
      const connections = dic[integrationId];

      if (integration && connections) {
        list.push({
          integration,
          connections,
        });
      }
    });

    return list;
  }, [
    availableIntegrationList,
    integrationConnections.isSuccess,
    integrationConnections.data,
  ]);

  const isLoading =
    !availableIntegrations.isFetched ||
    availableIntegrations.isLoading ||
    availableIntegrations.isFetching ||
    availableIntegrations.isFetchingNextPage ||
    !integrationConnections.isFetched ||
    integrationConnections.isLoading ||
    integrationConnections.isFetching ||
    integrationConnections.isFetchingNextPage;

  const IntegrationSkeleton = () => (
    <div className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line flex flex-row gap-4 items-center p-4 w-full">
      <Skeleton className="h-12 w-12 rounded-sm" />
      <Skeleton className="h-6 w-24 rounded" />
    </div>
  );

  return (
    <React.Fragment>
      <div className="flex flex-row gap-x-4 mt-1" style={{ width: "400px" }}>
        <Input.Root className="w-full">
          <Input.LeftIcon>
            <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
          </Input.LeftIcon>
          <Input.Core
            disabled={isLoading}
            placeholder="Search connections"
            onChange={(event) => {
              debouncedSetSearchValue(event.target.value);
            }}
            className="!leading-[22px]"
          />
        </Input.Root>
      </div>
      <Section
        initialAccordionValue={null}
        title={`Connected${integrationConnectionList.length > 0 ? ` (${integrationConnectionList.length})` : ""}`}
      >
        {isLoading ? (
          Array.from(new Array(2)).map((_item, index) => (
            <IntegrationSkeleton key={index} />
          ))
        ) : integrationConnectionList.length > 0 ? (
          integrationConnectionList.map((item) => (
            <ExistingConnection
              key={item.integration.id}
              integration={item.integration}
              connections={item.connections}
              namespaceId={selectedNamespaceId}
            />
          ))
        ) : (
          <p className="text-center p-4 text-semantic-fg-secondary text-sm">
            {searchInputValue
              ? "No connected integrations were found."
              : "You have no connected integrations yet. Take a look at the list below to find what you need."}
          </p>
        )}
      </Section>
      <Section initialAccordionValue={null} title="All">
        {isLoading ? (
          Array.from(new Array(2)).map((_item, index) => (
            <IntegrationSkeleton key={index} />
          ))
        ) : availableIntegrationList.length > 0 ? (
          availableIntegrationList.map((item) => (
            <ConnectableIntegration
              key={item.id}
              integration={item}
              namespaceId={selectedNamespaceId}
            />
          ))
        ) : (
          <p className="text-center p-4 text-semantic-fg-secondary text-sm">
            {searchInputValue
              ? "No available integrations were found."
              : "Sorry, there are no available integrations. Try refreshing the page."}
          </p>
        )}
      </Section>
    </React.Fragment>
  );
};
