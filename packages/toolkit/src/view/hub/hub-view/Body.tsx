"use client";

import * as React from "react";
import { Button, Icons, Input, Select, Tabs } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  Pipeline,
  useInfinitePipelines,
  useInstillStore,
  useShallow,
  useAuthenticatedUser,
  useUserPipelines,
} from "../../../lib";
import {
  LoadingSpin,
  UserProfileCard,
  CardPipeline,
  CardSkeletonPipeline,
  UserProfileCardProps,
} from "../../../components";
import debounce from "lodash.debounce";
const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Body = ({
  visitorCta,
}: {
  visitorCta?: UserProfileCardProps["visitorCta"];
}) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const pipelines = useInfinitePipelines({
    pageSize: 10,
    accessToken,
    enabledQuery,
    visibility: "VISIBILITY_PUBLIC",
    filter: searchCode ? `q="${searchCode}"` : null,
  });

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const userPipelines = useUserPipelines({
    userName: me.isSuccess ? me.data.name : null,
    enabled: enabledQuery && me.isSuccess,
    accessToken,
    filter: null,
    visibility: null,

    // Use these parameters to speed up request
    disabledViewFull: true,
    pageSize: 100,
  });

  const userPublicPipelines = React.useMemo(() => {
    if (!userPipelines.isSuccess) {
      return [];
    }

    return userPipelines.data.filter((pipeline) => {
      const toplevelRule = pipeline.sharing.users["*/*"];

      if (toplevelRule && toplevelRule.enabled) {
        return true;
      }

      return false;
    });
  }, [userPipelines.data, userPipelines.isSuccess]);

  const allPipelines = React.useMemo(() => {
    if (!pipelines.isSuccess) {
      return [];
    }

    const all: Pipeline[] = [];

    for (const page of pipelines.data.pages) {
      all.push(...page.pipelines);
    }

    return all;
  }, [pipelines.data, pipelines.isSuccess]);

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    []
  );

  return (
    <Tabs.Root defaultValue="explore" className="flex flex-col px-20">
      <Tabs.List className="mb-6 flex w-full flex-row gap-x-4">
        <Tabs.Trigger
          className="product-heading-text-6-semibold text-semantic-fg-primary"
          value="explore"
        >
          Explore
        </Tabs.Trigger>
        <Tabs.Trigger
          className="product-heading-text-6-semibold text-semantic-fg-primary"
          value="featured"
        >
          Featured
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="explore">
        <div className="flex flex-row">
          <div className="w-[288px] pr-4 pt-6">
            <UserProfileCard
              totalPipelines={null}
              totalPublicPipelines={userPublicPipelines.length}
              visitorCta={visitorCta}
            />
          </div>
          <div className="flex w-[630px] flex-col pt-6">
            <div className="mb-4 flex flex-col">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-semantic-fg-primary product-body-text-3-semibold">
                  Pipelines 34,010
                </p>
                <div className="flex items-center">
                  <Select.Root>
                    <Select.Trigger className="w-40">
                      <Select.Value placeholder="Sort" />
                      {/* <Select.Icon>
                        <Icons.ChevronDownSm className="h-4 w-4 stroke-semantic-fg-primary" />
                      </Select.Icon> */}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="option1">Option 1</Select.Item>
                      <Select.Item value="option2">Option 2</Select.Item>
                      <Select.Item value="option3">Option 3</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
              <div className="flex flex-row gap-x-4">
                <Input.Root className="flex-1">
                  <Input.LeftIcon>
                    <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                  </Input.LeftIcon>
                  <Input.Core
                    value={searchInputValue ?? ""}
                    placeholder="Search..."
                    onChange={(event) => {
                      setSearchInputValue(event.target.value);
                      debouncedSetSearchCode(event.target.value);
                    }}
                  />
                </Input.Root>
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-y-4">
              {pipelines.isSuccess && !pipelines.isFetching ? (
                allPipelines.length === 0 ? (
                  <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                    <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                      Let&rsquo;s build your first pipeline! 🙌
                    </p>
                  </div>
                ) : (
                  allPipelines.length &&
                  allPipelines.map((pipeline) => (
                    <CardPipeline
                      key={pipeline.uid}
                      ownerID={pipeline.owner_name.split("/")[1]}
                      pipeline={pipeline}
                      isOwner={pipeline.owner_name === me.data?.name}
                      disabledPermissionLabel={true}
                    />
                  ))
                )
              ) : (
                Array.from({ length: 10 }).map((_, index) => (
                  <CardSkeletonPipeline key={`card-skelton-${index}`} />
                ))
              )}
            </div>
            {pipelines.hasNextPage ? (
              <Button
                onClick={() => {
                  pipelines.fetchNextPage();
                }}
                variant="secondaryColour"
                size="md"
                className="w-full"
              >
                {pipelines.isFetchingNextPage ? <LoadingSpin /> : "Load More"}
              </Button>
            ) : null}
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="featured">
        <div className="flex flex-row">
          <div className="w-[288px] pr-4 pt-6">
            <UserProfileCard
              totalPipelines={null}
              totalPublicPipelines={userPublicPipelines.length}
              visitorCta={visitorCta}
            />
          </div>
          <div className="flex w-[630px] flex-col pt-6">
            <div className="mb-4 flex flex-col">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-semantic-fg-primary product-body-text-3-semibold">
                  Pipelines 34,010
                </p>
                <div className="flex items-center">
                  <Select.Root>
                    <Select.Trigger className="w-40">
                      <Select.Value placeholder="Sort" />
                      {/* <Select.Icon>
                        <Icons.ChevronDownSm className="h-4 w-4 stroke-semantic-fg-primary" />
                      </Select.Icon> */}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="option1">Option 1</Select.Item>
                      <Select.Item value="option2">Option 2</Select.Item>
                      <Select.Item value="option3">Option 3</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
              <div className="flex flex-row gap-x-4">
                <Input.Root className="flex-1">
                  <Input.LeftIcon>
                    <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                  </Input.LeftIcon>
                  <Input.Core
                    value={searchInputValue ?? ""}
                    placeholder="Search..."
                    onChange={(event) => {
                      setSearchInputValue(event.target.value);
                      debouncedSetSearchCode(event.target.value);
                    }}
                  />
                </Input.Root>
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-y-4">
              {pipelines.isSuccess && !pipelines.isFetching ? (
                allPipelines.length === 0 ? (
                  <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                    <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                      Let&rsquo;s build your first pipeline! 🙌
                    </p>
                  </div>
                ) : (
                  allPipelines.length &&
                  allPipelines.map((pipeline) => (
                    <CardPipeline
                      key={pipeline.uid}
                      ownerID={pipeline.owner_name.split("/")[1]}
                      pipeline={pipeline}
                      isOwner={pipeline.owner_name === me.data?.name}
                      disabledPermissionLabel={true}
                    />
                  ))
                )
              ) : (
                Array.from({ length: 10 }).map((_, index) => (
                  <CardSkeletonPipeline key={`card-skelton-${index}`} />
                ))
              )}
            </div>
            {pipelines.hasNextPage ? (
              <Button
                onClick={() => {
                  pipelines.fetchNextPage();
                }}
                variant="secondaryColour"
                size="md"
                className="w-full"
              >
                {pipelines.isFetchingNextPage ? <LoadingSpin /> : "Load More"}
              </Button>
            ) : null}
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};
