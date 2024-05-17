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
} from "../../../lib";
import {
  LoadingSpin,
  UserProfileCardProps,
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
    { value: "name-asc", label: "Name (Ascending)" },
    { value: "name-desc", label: "Name (Descending)" },
    { value: "createTime-asc", label: "Last Updated (Ascending)" },
    { value: "createTime-desc", label: "Last Updated (Descending)" },
  ];
  const [selectedSortOption, setSelectedSortOption] = React.useState(
    sortOptions[3].value
  );
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

  const filteredPipelines = React.useMemo(() => {
    if (tabValue === "featured") {
      return allPipelines.filter((pipeline) => pipeline.isFeatured);
    }
    return allPipelines;
  }, [allPipelines, tabValue]);

  const sortedPipelines = React.useMemo(() => {
    const [sortField, sortOrder] = selectedSortOption.split("-");

    return [...filteredPipelines].sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "createTime") {
        const dateA = new Date(a.create_time);
        const dateB = new Date(b.create_time);
        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
  }, [filteredPipelines, selectedSortOption]);

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    []
  );

  const handleSortOptionChange = (value: string) => {
    setSelectedSortOption(value);
  };

  return (
    <div className="flex flex-row">
      <div className="flex w-full flex-col pt-6">
        <div className="mb-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="whitespace-nowrap text-semantic-fg-disabled product-button-button-2">
              Pipelines{' '}
              {tabValue === 'featured'
                ? filteredPipelines.length
                : allPipelines.length}
            </p>
            <div className="flex w-full items-center justify-end gap-4">
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
              <Select.Root
                value={selectedSortOption}
                onValueChange={handleSortOptionChange}
              >
                <Select.Trigger className="max-w-40 rounded-[4px]">
                  <Select.Value className="font-bold">
                    {selectedSortOption
                      ? selectedSortOption === "name-asc" ||
                        selectedSortOption === "name-desc"
                        ? selectedSortOption.includes("asc")
                          ? "Name (Ascending)"
                          : "Name (Descending)"
                        : selectedSortOption.includes("asc")
                          ? "Last Updated (Ascending)"
                          : "Last Updated (Descending)"
                      : "Sort"}
                  </Select.Value>
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item
                      value={selectedSortOption.includes("name") ? selectedSortOption : "name-asc"}
                      className="flex justify-between text-semantic-fg-primary"
                      onClick={() => setSelectedSortOption(selectedSortOption.includes("name") ? selectedSortOption : "name-asc")}
                    >
                      Name
                      <span className="h-4 w-4">
                        <Icons.BookOpen02 />
                      </span>
                    </Select.Item>
                    <Select.Item
                      value={selectedSortOption.includes("createTime") ? selectedSortOption : "createTime-asc"}
                      className="flex justify-between text-semantic-fg-primary"
                      onClick={() => setSelectedSortOption(selectedSortOption.includes("createTime") ? selectedSortOption : "createTime-asc")}
                    >
                      Last Updated
                      <span className="h-4 w-4">
                        <Icons.RefreshCw05 />
                      </span>
                    </Select.Item>
                  </Select.Group>
                  <Select.Separator />
                  <Select.Group>
                    <Select.Item
                      value={selectedSortOption.includes("asc") ? selectedSortOption : selectedSortOption.replace("desc", "asc")}
                      className="flex justify-between text-semantic-fg-primary"
                      onClick={() => setSelectedSortOption(selectedSortOption.includes("asc") ? selectedSortOption : selectedSortOption.replace("desc", "asc"))}
                    >
                      Ascending
                      <span className="h-4 w-4">
                        <Icons.ArrowUp />
                      </span>
                    </Select.Item>
                    <Select.Item
                      value={selectedSortOption.includes("desc") ? selectedSortOption : selectedSortOption.replace("asc", "desc")}
                      className="flex justify-between text-semantic-fg-primary"
                      onClick={() => setSelectedSortOption(selectedSortOption.includes("desc") ? selectedSortOption : selectedSortOption.replace("asc", "desc"))}
                    >
                      Descending
                      <span className="h-4 w-4">
                        <Icons.ArrowDown />
                      </span>
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>
        {tabValue === "featured" && <FeaturedBanner />}
        <div className="mb-4 flex flex-col gap-y-4">
          {pipelines.isSuccess && !pipelines.isFetching ? (
            sortedPipelines.length === 0 ? (
              <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                  Let&rsquo;s build your first pipeline! 🙌
                </p>
              </div>
            ) : (
              sortedPipelines.map((pipeline) => (
                <CardPipeline
                  key={pipeline.uid}
                  ownerID={pipeline.owner_name.split("/")[1]}
                  pipeline={pipeline}
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
      <div className="ml-8 mt-6 flex w-1/4 flex-col">
        <div className="sticky top-6">
          <NewsLetterCard />
          <LatestChangesCard />
        </div>
      </div>
    </div>
  );
};

const FeaturedBanner = () => {
  const [showBanner, setShowBanner] = React.useState(true);

  return (
    <>
      {showBanner && (
        <div className="mb-3 flex items-center justify-between rounded-md bg-semantic-accent-bg p-2 text-semantic-fg-secondary">
          <p className="flex items-center justify-between">
            &nbsp; Want to feature your pipeline? Drop a message in&nbsp;{" "}
            <span className="font-bold">#featured</span>
            &nbsp; on &nbsp;
            <a
              href="https://discord.com/invite/sevxWsqpGh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-semantic-accent-default underline underline-offset-2"
            >
              <span className="flex items-center space-x-1">
                <span className="font-bold">Discord</span>
                <span className="flex h-4 w-4 items-center text-semantic-accent-default">
                  <DiscordIcon color="fill-semantic-accent-default" />
                </span>
              </span>
            </a>
          </p>
          <div className="flex items-center">
            <Button
              onClick={() => setShowBanner(false)}
              className="focus:outline-none"
              variant={"tertiaryGrey"}
            >
              <Icons.X className="h-5 w-5 stroke-semantic-fg-secondary" />
            </Button>
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
    "text-semantic-fg-disabled product-body-text-3-semibold data-[state=active]:text-semantic-fg-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-blue-500 pb-2";

  return (
    <div className="flex justify-between px-40 sm:px-10 md:px-20">
      <div className="flex w-full items-center">
        <Tabs.Root
          defaultValue="explore"
          className="mb-8 mt-4 w-full flex-col justify-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Tabs.List className="flex justify-center gap-4">
              <Tabs.Trigger className={tabTriggerStyle} value="explore">
                <span className="text-lg">Explore</span>
              </Tabs.Trigger>
              <Tabs.Trigger className={tabTriggerStyle} value="featured">
                <span className="text-lg">Featured</span>
              </Tabs.Trigger>
            </Tabs.List>
            <div className="w-full border-b border-gray-200"></div>
          </div>
          <div className="flex w-full flex-row">
            <div className="flex w-full flex-col">
              <Tabs.Content value="explore">
                <PipelineSection tabValue="explore" />
              </Tabs.Content>
              <Tabs.Content value="featured">
                <PipelineSection tabValue="featured" />
              </Tabs.Content>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};