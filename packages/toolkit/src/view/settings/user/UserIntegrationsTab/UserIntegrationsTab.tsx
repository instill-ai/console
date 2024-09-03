"use client";

import * as React from "react";
import { Integration } from "instill-sdk";

import { Icons, Input, Nullable, Skeleton } from "@instill-ai/design-system";

import { Setting } from "../..";
import {
  debounce,
  GeneralAppPageProp,
  useAuthenticatedUser,
  useInfiniteIntegrations,
} from "../../../../lib";
import { AvailableIntegration } from "./AvailableIntegration";
import { ExistingConnection } from "./ExistingConnection";
import { Section } from "./Section";

export type UserIntegrationsTabProps = GeneralAppPageProp;

export const UserIntegrationsTab = (props: UserIntegrationsTabProps) => {
  const { accessToken, enableQuery } = props;
  const me = useAuthenticatedUser({
    accessToken,
    enabled: enableQuery,
  });
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
  const debouncedSetSearchValue = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchInputValue(value);
      }, 300),
    [],
  );
  const availableIntegrations = useInfiniteIntegrations({
    accessToken,
    enabled: enableQuery,
    filter: searchInputValue ? `qIntegration="${searchInputValue}"` : null,
  });

  React.useEffect(() => {
    if (!availableIntegrations.data) {
      return;
    }

    if (
      availableIntegrations.data.pages[
        availableIntegrations.data.pages.length - 1
      ]?.nextPageToken
    ) {
      availableIntegrations.fetchNextPage();
    }
  }, [availableIntegrations.isSuccess, availableIntegrations.data]);

  const availableIntegrationList = React.useMemo(() => {
    return (
      availableIntegrations.data?.pages
        .reduce((acc: Integration[], page) => acc.concat(page.integrations), [])
        .sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        }) || []
    );
  }, [availableIntegrations.data]);

  const isLoadingAvailableIntegrations =
    !availableIntegrations.isFetched ||
    availableIntegrations.isLoading ||
    availableIntegrations.isFetching ||
    availableIntegrations.isFetchingNextPage;

  const IntegrationSkeleton = () => (
    <div className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line flex flex-row gap-4 items-center p-4 w-full">
      <Skeleton className="h-12 w-12 rounded-sm" />
      <Skeleton className="h-6 w-24 rounded" />
    </div>
  );

  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Integration"
        description="Easily configure and protect your connections"
      />
      <div className="flex flex-row gap-x-4 mt-1" style={{ width: "400px" }}>
        <Input.Root className="w-full">
          <Input.LeftIcon>
            <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
          </Input.LeftIcon>
          <Input.Core
            disabled={isLoadingAvailableIntegrations}
            placeholder="Search connections"
            onChange={(event) => {
              debouncedSetSearchValue(event.target.value);
            }}
            className="!leading-[22px]"
          />
        </Input.Root>
      </div>
      <Section title="Connected (3)">
        <ExistingConnection id="hello" />
        <ExistingConnection id="bye" />
      </Section>
      <Section title="All">
        {isLoadingAvailableIntegrations
          ? Array.from(new Array(2)).map((_item, index) => (
              <IntegrationSkeleton key={index} />
            ))
          : availableIntegrationList.map((item) => (
              <AvailableIntegration
                key={item.id}
                integration={item}
                accessToken={accessToken}
                enableQuery={enableQuery}
                namespaceId={me.isSuccess ? me.data.id : null}
              />
            ))}
      </Section>
    </Setting.TabRoot>
  );
};
