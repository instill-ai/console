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
  ImageWithFallback,
} from "../../../components";
import debounce from "lodash.debounce";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});
const WhatsNewComponent = () => (
  <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
    <h2 className="text-2xl font-bold">What's New?</h2>
    <ImageWithFallback
      src={`/icons/gcs.svg`}
      width={32}
      height={32}
      alt={`test-icon`}
      fallbackImg={<Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />}
    />
    <div className="inline-block rounded-sm bg-blue-500 px-2 py-1 font-bold text-white">
      Tag
    </div>
    <p>Text goes here</p>
  </div>
);

const LatestChangesComponent = () => (
  <div className="mt-4 flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
    <h2 className="text-2xl font-bold">Latest Changes</h2>
    <div className="inline-block rounded-sm bg-blue-500 px-2 py-1 font-bold text-white">
      Tag
    </div>
    <p>Text goes here</p>
    <div className="inline-block rounded-sm bg-blue-500 px-2 py-1 font-bold text-white">
      Tag
    </div>
    <p>Text goes here</p>
  </div>
);
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

  const tabTriggerStyle =
    "rounded-t-sm border border-semantic-bg-line bg-semantic-bg-base-bg px-3 py-1.5 text-[#1D2433] text-opacity-80 product-body-text-3-semibold data-[state=active]:bg-semantic-bg-primary data-[state=active]:text-opacity-100";
  const tabContentStyle =
    "h-full w-full rounded-sm border border-semantic-bg-line bg-semantic-accent-bg p-2";

  return (
    <div className="flex justify-between px-80 sm:px-20 md:px-60">
      <div className="flex w-full items-center">
        <Tabs.Root
          defaultValue="explore"
          className="mb-8 w-full  flex-col justify-center"
        >
          <Tabs.List className="flex justify-center gap-4">
            <Tabs.Trigger className={tabTriggerStyle} value="explore">
              Explore
            </Tabs.Trigger>
            <Tabs.Trigger className={tabTriggerStyle} value="featured">
              Featured
            </Tabs.Trigger>
          </Tabs.List>
          <div className="flex w-full flex-row">
            <div className="flex w-full flex-col">
              <Tabs.Content value="explore">
                <div className="flex flex-row">
                  {/* <div className="w-[288px] pr-4 pt-6">
                    <UserProfileCard
                      totalPipelines={null}
                      totalPublicPipelines={userPublicPipelines.length}
                      visitorCta={visitorCta}
                    />
                  </div> */}
                  <div className="flex w-full flex-col pt-6">
                    <div className="mb-4 flex flex-col">
                      <div className="mb-2.5 flex items-center justify-between">
                        <p className="text-semantic-fg-primary product-body-text-3-semibold">
                          Pipelines 34,010
                        </p>
                        <div className="flex items-center">
                          <Input.Root className="w-64">
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
                        <Select.Root>
                          <Select.Trigger className="max-w-40">
                            <Select.Value placeholder="Sort" />
                            {/* <Select.Icon /> */}
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="option1">Option 1</Select.Item>
                            <Select.Item value="option2">Option 2</Select.Item>
                            <Select.Item value="option3">Option 3</Select.Item>
                          </Select.Content>
                        </Select.Root>
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
                        {pipelines.isFetchingNextPage ? (
                          <LoadingSpin />
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Tabs.Content>
              <Tabs.Content value="featured">
                <div className="flex flex-row">
                  {/* <div className="w-[288px] pr-4 pt-6">
                    <UserProfileCard
                      totalPipelines={null}
                      totalPublicPipelines={userPublicPipelines.length}
                      visitorCta={visitorCta}
                    />
                  </div> */}
                  <div className="flex w-full flex-col pt-6">
                    <div className="mb-4 flex w-full flex-col">
                      <div className="mb-2.5 flex items-center justify-between">
                        <p className="text-semantic-fg-primary product-body-text-3-semibold">
                          Pipelines 34,010
                        </p>
                        <div className="flex items-center">
                          <Input.Root className="w-64">
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
                        <Select.Root>
                          <Select.Trigger className="w-40">
                            <Select.Value placeholder="Sort" />
                            {/* <Select.Icon /> */}
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="option1">Option 1</Select.Item>
                            <Select.Item value="option2">Option 2</Select.Item>
                            <Select.Item value="option3">Option 3</Select.Item>
                          </Select.Content>
                        </Select.Root>
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
                        {pipelines.isFetchingNextPage ? (
                          <LoadingSpin />
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </div>
        </Tabs.Root>
      </div>
      <div className="ml-8 w-80">
        <WhatsNewComponent />
        <LatestChangesComponent />
      </div>
    </div>
  );
};
