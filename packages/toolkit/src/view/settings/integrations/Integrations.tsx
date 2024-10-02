"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Integration, IntegrationConnection } from "instill-sdk";

import { Icons, Input, Nullable, Skeleton } from "@instill-ai/design-system";

import {
  OAuthCallbackConnectionIdQueryParam,
  OAuthCallbackIntegrationIdQueryParam,
  OAuthCallbackStatusQueryParam,
} from "../../../constant";
import {
  debounce,
  initializeIntegrationConnection,
  useInfiniteIntegrationConnections,
  useInfiniteIntegrations,
} from "../../../lib";
import { AvailableIntegration } from "./AvailableIntegration";
import {
  ExistingConnection,
  getAccordionId,
} from "./existing-connection/ExistingConnection";
import { Section } from "./Section";

export type IntegrationsProps = {
  namespaceId: Nullable<string>;
  enableQuery: boolean;
  accessToken: Nullable<string>;
};

export const Integrations = (props: IntegrationsProps) => {
  const searchParams = useSearchParams();
  const oAuthCallbackConnectionId = searchParams.get(
    OAuthCallbackConnectionIdQueryParam,
  );
  const oAuthCallbackIntegrationId = searchParams.get(
    OAuthCallbackIntegrationIdQueryParam,
  );
  const oAuthCallbackStatus = searchParams.get(OAuthCallbackStatusQueryParam);
  const isHighlightedSuccessfullyCreatedIntegration = React.useRef(false);
  const [initialAccordionValue, setInitialAccordionValue] =
    React.useState<Nullable<string>>(null);
  const { accessToken, enableQuery, namespaceId } = props;
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
  const debouncedSetSearchValue = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchInputValue(value);
      }, 500),
    [],
  );

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (
      oAuthCallbackStatus === "success" &&
      oAuthCallbackConnectionId &&
      oAuthCallbackIntegrationId &&
      !isHighlightedSuccessfullyCreatedIntegration.current
    ) {
      setInitialAccordionValue(getAccordionId(oAuthCallbackIntegrationId));
      console.log(
        "setInitialAccordionValue",
        getAccordionId(oAuthCallbackIntegrationId),
      );
      isHighlightedSuccessfullyCreatedIntegration.current = true;
    }

    return () => clearTimeout(timeoutId);
  }, [
    oAuthCallbackStatus,
    oAuthCallbackConnectionId,
    oAuthCallbackIntegrationId,
  ]);

  const availableIntegrations = useInfiniteIntegrations({
    accessToken,
    enabled: enableQuery,
    filter: searchInputValue ? `qIntegration="${searchInputValue}"` : null,
  });
  const integrationConnections = useInfiniteIntegrationConnections({
    namespaceId,
    accessToken,
    enabled: enableQuery,
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

    integrationConnections.data?.pages.forEach((page) => {
      page.connections.forEach((connection) => {
        if (!dic[connection.integrationId]) {
          dic[connection.integrationId] = [];
        }

        dic[connection.integrationId]?.push(connection);
      });
    });

    Object.keys(dic)
      //.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
      .forEach((integrationId) => {
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
        <button
          onClick={async () => {
            await initializeIntegrationConnection(
              "google",
              "hello-world",
              "admin",
              "google",
            );
          }}
        >
          Login
        </button>
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
        initialAccordionValue={initialAccordionValue}
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
              namespaceId={namespaceId}
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
            <AvailableIntegration
              key={item.id}
              integration={item}
              namespaceId={namespaceId}
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
