"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

import { Icons, Input, Select } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  useInfiniteNamespacePipelines,
  useInstillStore,
  useRouteInfo,
  useShallow,
  Visibility,
} from "../../../lib";
import { CreatePipelineDialog } from "./CreatePipelineDialog";
import { PipelinesList } from "./PipelinesList";
import { PipelinesListPagination } from "./PipelinesListPagination";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipelines = () => {
  const searchParams = useSearchParams();
  const visibility = searchParams.get("visibility");
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
  const [pageNumber, setPageNumber] = React.useState(0);

  const [selectedVisibilityOption, setSelectedVisibilityOption] =
    React.useState<Visibility>(
      visibility === "VISIBILITY_PUBLIC"
        ? "VISIBILITY_PUBLIC"
        : "VISIBILITY_UNSPECIFIED",
    );

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipelines = useInfiniteNamespacePipelines({
    namespaceName: routeInfo.data.namespaceName,
    pageSize: 10,
    accessToken,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    filter: searchCode ? `q="${searchCode}"` : null,
    visibility: selectedVisibilityOption ?? null,
  });

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    [],
  );

  const isLoadingResource =
    !pipelines.isFetched ||
    pipelines.isLoading ||
    pipelines.isFetching ||
    pipelines.isFetchingNextPage;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-row items-end gap-x-3">
        <div className="flex w-[300px] flex-col gap-y-2.5">
          <p className="text-semantic-fg-primary product-body-text-3-semibold">
            Search Pipelines
          </p>
          <div className="mt-auto flex flex-row gap-x-4">
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
                className="!leading-[22px]"
              />
            </Input.Root>
          </div>
        </div>
        <div className="flex w-[300px] min-w-52 flex-col gap-y-2.5">
          <p className="text-semantic-fg-primary product-body-text-3-semibold">
            Visibility
          </p>
          <Select.Root
            value={selectedVisibilityOption}
            onValueChange={(value) => {
              setSelectedVisibilityOption(value as Visibility);
            }}
          >
            <Select.Trigger className="mt-auto w-full !rounded">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item value="VISIBILITY_UNSPECIFIED" label="All" />
                <Select.Item value="VISIBILITY_PUBLIC" label="Public" />
                <Select.Item value="VISIBILITY_PRIVATE" label="Private" />
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <CreatePipelineDialog className="ml-auto" />
        {/* <Button
          className="ml-auto gap-x-2"
          variant="primary"
          size="lg"
          onClick={() => {
            router.push(`/${routeInfo.data.namespaceId}/pipelines/create`);
          }}
        >
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Create Pipeline
        </Button> */}
      </div>
      <PipelinesList
        pipelines={
          pipelines.isSuccess
            ? (pipelines.data.pages[pageNumber]?.pipelines ?? [])
            : []
        }
        onPipelineDelete={pipelines.refetch}
        isLoading={isLoadingResource}
        isSearchActive={!!searchCode}
      />
      <PipelinesListPagination
        pipelines={pipelines}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
      />
    </div>
  );
};
