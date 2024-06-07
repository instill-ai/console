import {
  Button,
  Icons,
  Input,
  Popover,
  Separator,
} from "@instill-ai/design-system";
import { LoadingSpin } from "../../../components";
import { CardModel } from "../../../components/card-model";
import * as React from "react";
import { Nullable } from "vitest";
import {
  InstillStore,
  useHubStats,
  useInfiniteModels,
  useInstillStore,
  useShallow,
} from "../../../lib";
import debounce from "lodash.debounce";
import SortSelectButton from "./SortSelectButton";
import FeaturedBanner from "./FeaturedBanner";
import { CardModelSkeleton } from "../../../components/card-model/Skeleton";

type ModelSectionProps = {
  tabValue: "explore" | "featured";
};

type SortField = "update_time";
type SortOrder = "asc" | "desc";

const ModelSection = ({ tabValue }: ModelSectionProps) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [selectedSortField, setSelectedSortField] =
    React.useState<SortField>("update_time");
  const [selectedSortOrder, setSelectedSortOrder] =
    React.useState<SortOrder>("desc");
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
  const selector = (store: InstillStore) => ({
    accessToken: store.accessToken,
    enabledQuery: store.enabledQuery,
  });

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const selectedSortOption = React.useMemo(() => {
    return `${selectedSortField} ${selectedSortOrder}`;
  }, [selectedSortField, selectedSortOrder]);

  const models = useInfiniteModels({
    pageSize: 10,
    accessToken,
    enabledQuery,
    visibility: "VISIBILITY_PUBLIC",
    filter:
      tabValue === "featured"
        ? searchCode
          ? `tag="featured" AND q="${searchCode}"`
          : `tag="featured"`
        : searchCode
          ? `q="${searchCode}"`
          : "",
    order_by: selectedSortOption,
  });

  const allModels = React.useMemo(() => {
    if (!models.isSuccess) return [];
    return models.data.pages.flatMap((page) => page.models);
  }, [models.data, models.isSuccess]);

  const hubStats = useHubStats({ enabled: true });

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    []
  );

  const handleSortFieldChange = (field: SortField) => {
    setSelectedSortField(field);
  };

  const handleSortOrderChange = (order: SortOrder) => {
    setSelectedSortOrder(order);
  };

  return (
    <div className="mt-2 flex w-full flex-col">
      <div className="mb-4 flex flex-col">
        <div className="flex items-center justify-between">
          <p className="whitespace-nowrap text-semantic-fg-disabled product-button-button-2">
            Models{" "}
            {tabValue === "featured"
              ? hubStats.data?.number_of_featured_pipelines
              : hubStats.data?.number_of_public_pipelines}
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
                  onClick={() => handleSortFieldChange("update_time")}
                  isSelected={selectedSortField === "update_time"}
                />
                <Separator orientation="horizontal" className="my-1" />
                <SortSelectButton
                  label="Ascending"
                  icon={
                    <Icons.SortLinesUp className="h-4 w-4 stroke-semantic-fg-disabled" />
                  }
                  onClick={() => handleSortOrderChange("asc")}
                  isSelected={selectedSortOrder === "asc"}
                />
                <SortSelectButton
                  label="Descending"
                  icon={
                    <Icons.SortLinesDown className="h-4 w-4 stroke-semantic-fg-disabled" />
                  }
                  onClick={() => handleSortOrderChange("desc")}
                  isSelected={selectedSortOrder === "desc"}
                />
              </Popover.Content>
            </Popover.Root>
          </div>
        </div>
      </div>
      {tabValue === "featured" && <FeaturedBanner />}
      <div className="mb-4 flex flex-col gap-y-4">
        {models.isSuccess && !models.isFetching ? (
          allModels.length === 0 ? (
            <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
              <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                Let's create your first model! 🙌
              </p>
            </div>
          ) : (
            allModels.map((model) => (
              <CardModel key={model.uid} model={model} />
            ))
          )
        ) : (
          Array.from({ length: 10 }).map((_, index) => (
            <CardModelSkeleton key={`card-skeleton-${index}`} />
          ))
        )}
      </div>
      {models.hasNextPage ? (
        <Button
          onClick={() => models.fetchNextPage()}
          variant="secondaryColour"
          size="md"
          className="w-full"
        >
          {models.isFetchingNextPage ? <LoadingSpin /> : "Load More"}
        </Button>
      ) : null}
    </div>
  );
};
export default ModelSection;
