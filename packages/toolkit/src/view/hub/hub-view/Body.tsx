"use client";

import * as React from "react";
import {
  Button,
  DiscordIcon,
  Input,
  Select,
  Separator,
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
import { Icons } from "./../../../../../design-system/src/new-ui/Icons";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

const PipelineSection: React.FC<{ tabValue: string }> = ({ tabValue }) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [selectedSortField, setSelectedSortField] = React.useState<string>("update_time");
  const [selectedSortOrder, setSelectedSortOrder] = React.useState<string>("desc");
  const [searchInputValue, setSearchInputValue] = React.useState<Nullable<string>>(null);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const selectedSortOption = React.useMemo(() => {
    if (selectedSortField && selectedSortOrder) {
      return `=order_by${selectedSortField} ${selectedSortOrder}`;
    }
    return "";
  }, [selectedSortField, selectedSortOrder]);

  const pipelines = useInfinitePipelines({
    pageSize: 10,
    accessToken,
    enabledQuery,
    visibility: "VISIBILITY_PUBLIC",
    filter:
      tabValue === "featured"
        ? `tag="featured" AND q="${searchCode ?? ""}"`
        : `q="${searchCode ?? ""}"`,
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

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    []
  );

  const handleSortOptionChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setSelectedSortOrder(value);
    } else {
      setSelectedSortField(value);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex w-full flex-col pt-6">
        <div className="mb-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="whitespace-nowrap text-semantic-fg-disabled product-button-button-2">
              Pipelines{' '}{allPipelines.length}
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
                value={selectedSortField}
                onValueChange={handleSortOptionChange}
              >
                <Select.Trigger className="max-w-24 rounded-[4px]">
                  <Select.Value className="font-bold">
                    Sort
                  </Select.Value>
                </Select.Trigger>
                <Select.Content className="w-64 -ml-40">
                  <Select.Group>
                    <Select.Item
                      value="id"
                      className="flex justify-between text-semantic-fg-primary product-body-text-3-medium"
                    >
                      Name
                      <span className="h-4 w-4">
                        <Icons.TextA className="stroke-semantic-fg-disabled" />
                      </span>
                    </Select.Item>
                    <Select.Item
                      value="update_time"
                      className="flex justify-between text-semantic-fg-primary product-body-text-3-medium"
                    >
                      Last Updated
                      <span className="h-4 w-4">
                        <Icons.Update className=" stroke-semantic-fg-disabled" />
                      </span>
                    </Select.Item>
                  </Select.Group>
                  <Select.Separator className=" bg-semantic-bg-line" />
                  <Select.Group>
                    <Select.Item
                      value="asc"
                      className="flex justify-between text-semantic-fg-primary product-body-text-3-medium"
                      onClick={() => setSelectedSortOrder("asc")}
                    >
                      Ascending
                      <span className="h-4 w-4">
                        <Icons.SortLinesUp className=" stroke-semantic-fg-disabled" />
                      </span>
                    </Select.Item>
                    <Select.Item
                      value="desc"
                      className="flex justify-between text-semantic-fg-primary product-body-text-3-medium"
                      onClick={() => setSelectedSortOrder("desc")}
                    >
                      Descending
                      <span className="h-4 w-4">
                        <Icons.SortLinesDown className="stroke-semantic-fg-disabled" />
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
            <Separator orientation="horizontal" />
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