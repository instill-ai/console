"use client";

import * as React from "react";
import {
  Button,
  DiscordIcon,
  Icons,
  Input,
  Select,
  Tabs,
} from "@instill-ai/design-system";

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
  UserProfileCardProps,
  ImageWithFallback,
} from "../../../components";
import debounce from "lodash.debounce";
import NewsLetterCard from "../../../components/NewsLetterCard";
import LatestChangesCard from "../../../components/LatestChangesCard";
import {
  CardPipeline,
  CardSkeletonPipeline,
} from "../../../components/card-pipeline-hub";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

const PipelineSection = ({ tabValue }: { tabValue: string }) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const sortOptions = [
    { value: "name", label: "Name", icon: <Icons.User01 /> },
    { value: "updatedAt", label: "Last Updated", icon: <Icons.User01 /> },
    { value: "ascending", label: "Ascending", icon: <Icons.User01 /> },
    { value: "descending", label: "Descending", icon: <Icons.User01 /> },
  ];
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
  const [selectedSortOption, setSelectedSortOption] = React.useState(sortOptions[0].value);

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

  const handleSortChange = (value: string) => {
    setSelectedSortOption(value);
    // Perform the sorting logic based on the selected option
    // You can use the `value` to determine the sorting criteria
    // and update the `pipelines` data accordingly
    // For example:
    // const sortedPipelines = [...pipelines].sort((a, b) => {
    //   if (value === "createdAt") {
    //     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    //   } else if (value === "updatedAt") {
    //     return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    //   } else if (value === "name") {
    //     return a.name.localeCompare(b.name);
    //   }
    // });
    // Update the `pipelines` state with the sorted data
    // setPipelines(sortedPipelines);
  };

  return (
    <div className="flex flex-row">
      <div className="flex w-full flex-col pt-6">
        <div className="mb-4 flex flex-col">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-semantic-fg-secondary product-body-text-3-semibold whitespace-nowrap">
              Pipelines 34,010
            </p>
            <div className="flex justify-end items-center gap-4 w-full">
              <Input.Root className="w-1/3">
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
              <Select.Root value={selectedSortOption} onValueChange={handleSortChange}>
                <Select.Trigger className="max-w-40">
                  <Select.Value>
                    {sortOptions.find((option) => option.value === selectedSortOption)?.label || "Sort"}
                  </Select.Value>
                  {/* <Select.Icon /> */}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {sortOptions.slice(0, 2).map((option) => (
                      <Select.Item key={option.value} value={option.value} className="flex justify-between">
                        {option.label}<span className="w-4 h-4">{option.icon}</span>
                      </Select.Item>
                    ))}
                  </Select.Group>
                  <Select.Separator />
                  <Select.Group>
                    {sortOptions.slice(2, 4).map((option) => (
                      <Select.Item key={option.value} value={option.value} className="flex justify-between">
                        {option.label}<span className="w-4 h-4">{option.icon}</span>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
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
  );
};

const FeaturedBanner = () => {
  const [showBanner, setShowBanner] = React.useState(true);

  return (
    <>
      {showBanner && (
        <div className="mb-3 flex items-center justify-between rounded-md bg-semantic-accent-bg p-4 text-semantic-fg-secondary mt-4">
          <p className="flex items-center justify-between">
            &nbsp; Want to feature your pipeline? Drop a message in&nbsp;{" "}
            <span className="font-bold">#featured</span>
            &nbsp; on
            <button className="font-bold text-semantic-accent-default underline underline-offset-2">
              Discord
            </button>
            <a
              href="https://discord.com/invite/sevxWsqpGh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-4 w-4 items-center text-semantic-accent-default"
            >
              <DiscordIcon />
            </a>
          </p>
          <div className="flex items-center">
            <button
              onClick={() => setShowBanner(false)}
              className="focus:outline-none"
            >
              <Icons.ReferenceIconX className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const Body = ({
  visitorCta,
}: {
  visitorCta?: UserProfileCardProps["visitorCta"];
}) => {
  const tabTriggerStyle =
    "text-gray-600 product-body-text-3-semibold data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-blue-500";

  return (
    <div className="flex justify-between px-80 sm:px-20 md:px-60">
      <div className="flex w-full items-center">
        <Tabs.Root
          defaultValue="explore"
          className="mb-8 w-full flex-col justify-center mt-4"
        >
          <div className="flex flex-col justify-center items-center">
            <Tabs.List className="flex gap-4 justify-center">
              <Tabs.Trigger className={tabTriggerStyle} value="explore">
                <span className="text-lg">Explore</span>
              </Tabs.Trigger>
              <Tabs.Trigger className={tabTriggerStyle} value="featured">
                <span className="text-lg">Featured</span>
              </Tabs.Trigger>
            </Tabs.List>
            <div className="border-b border-gray-200 w-full"></div>
          </div>
          <div className="flex w-full flex-row">
            <div className="flex w-full flex-col">
              <Tabs.Content value="explore">
                <PipelineSection tabValue="explore" />
              </Tabs.Content>
              <Tabs.Content value="featured">
                <FeaturedBanner />
                <PipelineSection tabValue="featured" />
              </Tabs.Content>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};