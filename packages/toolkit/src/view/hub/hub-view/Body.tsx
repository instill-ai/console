"use client";

import cn from "clsx";
import * as React from "react";
import {
  Button,
  DiscordIcon,
  Icons,
  Input,
  Popover,
  Separator,
  Tabs,
} from "@instill-ai/design-system";

import {
  InstillStore,
  Model,
  Nullable,
  Pipeline,
  useHubStats,
  useInfiniteModels,
  useInfinitePipelines,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { LoadingSpin } from "../../../components";
import debounce from "lodash.debounce";
import { NewsLetterCard } from "./NewsLetterCard";
import { LatestChangesCard } from "./LatestChangesCard";
import { CardPipeline, CardSkeletonPipeline } from "./card-pipeline-hub";
import { CardModelSkeleton } from "../../../components/card-model/Skeleton";
import { CardModel } from "../../../components/card-model";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

type SortField = "update_time";
type SortOrder = "asc" | "desc";

const SortSelectButton = ({
  onClick,
  label,
  icon,
  isSelected,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center px-4 py-[9px] hover:bg-semantic-bg-base-bg"
    >
      <div className="flex flex-row items-center gap-x-2">
        {icon}
        <span className="text-semantic-fg-primary product-body-text-3-medium">
          {label}
        </span>
      </div>
      {isSelected ? (
        <Icons.Check className="ml-auto h-4 w-4 stroke-semantic-fg-disabled" />
      ) : null}
    </button>
  );
};

type DataType = "pipelines" | "models";

const ListSection: React.FC<{ tabValue: string; dataType?: DataType }> = ({
  tabValue,
  dataType = "pipelines",
}) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [selectedSortField, setSelectedSortField] =
    React.useState<SortField>("update_time");
  const [selectedSortOrder, setSelectedSortOrder] =
    React.useState<SortOrder>("desc");
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const selectedSortOption = React.useMemo(() => {
    if (selectedSortField && selectedSortOrder) {
      return `${selectedSortField} ${selectedSortOrder}`;
    }
    return "";
  }, [selectedSortField, selectedSortOrder]);

  const pipelines = useInfinitePipelines({
    pageSize: 10,
    accessToken,
    enabledQuery: dataType === "pipelines" && enabledQuery,
    visibility: "VISIBILITY_PUBLIC",
    filter:
      tabValue === "featured"
        ? searchCode
          ? `tag="featured" AND q="${searchCode ?? ""}"`
          : `tag="featured"`
        : searchCode
          ? `q="${searchCode}"`
          : "",
    order_by: selectedSortOption,
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

  const models = useInfiniteModels({
    pageSize: 10,
    accessToken,
    enabledQuery: dataType === "models" && enabledQuery,
    visibility: "VISIBILITY_PUBLIC",
    filter:
      tabValue === "featured"
        ? searchCode
          ? `tag="featured" AND q="${searchCode ?? ""}"`
          : `tag="featured"`
        : searchCode
          ? `q="${searchCode}"`
          : "",
    order_by: selectedSortOption,
  });

  const allModels = React.useMemo(() => {
    if (!models.isSuccess) {
      return [];
    }

    const all: Model[] = [];

    for (const page of models.data.pages) {
      all.push(...page.models);
    }

    return all;
  }, [models]);

  const hubStats = useHubStats({
    enabled: true,
  });

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    []
  );

  const isFetchingNextPage = React.useMemo(() => {
    if (dataType === "pipelines") {
      return pipelines.isFetchingNextPage;
    } else {
      return models.isFetchingNextPage;
    }
  }, [dataType, pipelines, models]);

  const hasNextPage = React.useMemo(() => {
    if (dataType === "pipelines") {
      return pipelines.hasNextPage;
    } else {
      return models.hasNextPage;
    }
  }, [dataType, pipelines, models]);

  const refetchData = () => {
    if (dataType === "pipelines") {
      pipelines.refetch();
    } else {
      models.refetch();
    }
  };

  const fetchNextPage = () => {
    if (dataType === "pipelines") {
      pipelines.fetchNextPage();
    } else {
      models.fetchNextPage();
    }
  };

  const handleSortFieldChange = (value: SortField) => {
    if (selectedSortField !== value) {
      setSelectedSortField(value);
      refetchData();
    }
  };

  return (
    <div className="flex flex-row">
      <div className="mt-2 flex w-full flex-col pt-20">
        <div className="mb-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="whitespace-nowrap text-semantic-fg-disabled product-button-button-2">
              {dataType === "pipelines" ? (
                <React.Fragment>
                  Pipelines{" "}
                  {tabValue === "featured"
                    ? hubStats.data?.number_of_featured_pipelines
                    : hubStats.data?.number_of_public_pipelines}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Models
                  {models.isSuccess && models.data.pages?.[0]?.total_size ? (
                    <React.Fragment>
                      {" "}
                      {models.data.pages[0].total_size}
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              )}
            </p>
            <div className="flex w-full items-center justify-end gap-4">
              <Input.Root className="w-[431px] !rounded">
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
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 text-semantic-fg-primary product-button-button-1">
                    Sort
                    <Icons.ChevronDown className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                  </button>
                </Popover.Trigger>
                <Popover.Content
                  align="end"
                  className="flex w-64 flex-col !px-0 py-1"
                >
                  <SortSelectButton
                    label="Updated Time"
                    icon={
                      <Icons.Update className="h-4 w-4 stroke-semantic-fg-disabled" />
                    }
                    onClick={() => {
                      handleSortFieldChange("update_time");
                    }}
                    isSelected={selectedSortField === "update_time"}
                  />

                  <Separator orientation="horizontal" className="my-1" />
                  <SortSelectButton
                    label="Ascending"
                    icon={
                      <Icons.SortLinesUp className="h-4 w-4 stroke-semantic-fg-disabled" />
                    }
                    onClick={() => {
                      setSelectedSortOrder("asc");
                    }}
                    isSelected={selectedSortOrder === "asc"}
                  />
                  <SortSelectButton
                    label="Descending"
                    icon={
                      <Icons.SortLinesDown className="h-4 w-4 stroke-semantic-fg-disabled" />
                    }
                    onClick={() => {
                      setSelectedSortOrder("desc");
                    }}
                    isSelected={selectedSortOrder === "desc"}
                  />
                </Popover.Content>
              </Popover.Root>
            </div>
          </div>
        </div>
        {tabValue === "featured" && <FeaturedBanner />}
        <div className="mb-4 flex flex-col gap-y-4">
          {dataType === "pipelines" ? (
            pipelines.isSuccess && !pipelines.isFetching ? (
              allPipelines.length === 0 ? (
                <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                  <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                    Let&rsquo;s build your first pipeline! 🙌
                  </p>
                </div>
              ) : (
                allPipelines.map((pipeline) => (
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
            )
          ) : models.isSuccess && !models.isFetching ? (
            allModels.length === 0 ? (
              <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                  Let&rsquo;s create your first model! 🙌
                </p>
              </div>
            ) : (
              allModels.map((model) => (
                <CardModel key={model.uid} model={model} />
              ))
            )
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <CardModelSkeleton key={`card-skelton-${index}`} />
            ))
          )}
          {}
        </div>
        {hasNextPage ? (
          <Button
            onClick={fetchNextPage}
            variant="secondaryColour"
            size="md"
            className="w-full"
          >
            {isFetchingNextPage ? <LoadingSpin /> : "Load More"}
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
        <div className="mb-3 flex items-center justify-between rounded-sm bg-semantic-accent-bg px-4 py-2 text-semantic-fg-secondary">
          <p className="flex items-center justify-between font-normal">
            Want to feature your pipeline? Drop a message in &nbsp;
            <span className="font-bold">#show-your-work</span>
            &nbsp;on&nbsp;
            <a
              href="https://discord.com/invite/sevxWsqpGh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-semantic-accent-default"
            >
              <span className="relative inline-flex items-center space-x-1 font-semibold">
                <span>Discord</span>
                <span className="inline-flex h-4 w-4 items-center text-semantic-accent-default">
                  <DiscordIcon color="fill-semantic-accent-default" />
                </span>
                <span className="absolute -left-1 bottom-0 right-0 h-0.5 bg-semantic-accent-default"></span>
              </span>
            </a>
          </p>
          <div className="flex items-center">
            {/* 
              There has no button variant in the design handover. We will use
              default button without hover effect for this.
            */}
            <button onClick={() => setShowBanner(false)}>
              <Icons.X className="h-5 w-5 stroke-semantic-fg-secondary" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const Body = () => {
  const [exploreDataType, setExploreDataType] =
    React.useState<DataType>("pipelines");
  // The design-token we have right now doesn't support alpha value, so we need to use hex here
  const tabTriggerStyle =
    "text-semantic-fg-disabled product-body-text-3-semibold border-black data-[state=active]:text-semantic-fg-primary border-b-2 border-opacity-0 data-[state=active]:border-opacity-100 data-[state=active]:border-[#316FED] pb-2";
  const dataTypeTriggerStyle =
    "px-4 h-full border border-semantic-bg-line text-base font-semibold flex items-center justify-center";
  const dataTypeTriggerStyleActive =
    "cursor-default bg-semantic-accent-bg text-semantic-accent-default";
  const dataTypeTriggerStyleInactive = "bg-semantic-bg-primary cursor-pointer";

  return (
    <div className="flex justify-between">
      <div className="flex w-full items-center">
        <Tabs.Root
          defaultValue="explore"
          className="mb-8 mt-4 w-full flex-col justify-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Tabs.List
              className={cn(
                "flex justify-center gap-6",
                exploreDataType === "models"
                  ? "[&>*:last-child]:pointer-events-none [&>*:last-child]:opacity-0"
                  : ""
              )}
            >
              <React.Fragment>
                <Tabs.Trigger className={tabTriggerStyle} value="explore">
                  <span className="text-lg">Explore</span>
                </Tabs.Trigger>
                <Tabs.Trigger className={tabTriggerStyle} value="featured">
                  <span className="text-lg">Featured</span>
                </Tabs.Trigger>
              </React.Fragment>
            </Tabs.List>
            <Separator orientation="horizontal" />
          </div>
          <div className=" bg-semantic-bg-base-bg">
            <div className="xl:px-30 flex w-full flex-row space-x-4 sm:px-5 md:px-10 lg:px-20">
              <div className="flex w-full flex-col">
                <Tabs.Content value="explore">
                  <ListSection tabValue="explore" dataType={exploreDataType} />
                </Tabs.Content>
                <Tabs.Content value="featured">
                  <ListSection tabValue="featured" />
                </Tabs.Content>
              </div>
              <div className="flex w-1/6 min-w-[272px] flex-col">
                <div className="sticky top-6">
                  <div className="my-6 h-10">
                    <Tabs.Content value="explore">
                      <div className="flex h-10 flex-row justify-end">
                        <div
                          onClick={() => setExploreDataType("pipelines")}
                          className={cn(
                            dataTypeTriggerStyle,
                            "rounded-l",
                            exploreDataType === "pipelines"
                              ? dataTypeTriggerStyleActive
                              : dataTypeTriggerStyleInactive
                          )}
                        >
                          Pipelines
                        </div>
                        <div
                          onClick={() => setExploreDataType("models")}
                          className={cn(
                            dataTypeTriggerStyle,
                            "rounded-r border-l-0",
                            exploreDataType === "models"
                              ? dataTypeTriggerStyleActive
                              : dataTypeTriggerStyleInactive
                          )}
                        >
                          Models
                        </div>
                      </div>
                    </Tabs.Content>
                  </div>
                  <div className="mb-4">
                    <NewsLetterCard />
                  </div>
                  <LatestChangesCard />
                </div>
              </div>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};
