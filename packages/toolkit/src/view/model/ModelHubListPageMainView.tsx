"use client";

import { Button, Input, Icons, Select } from "@instill-ai/design-system";
import {
  GeneralAppPageProp,
  Visibility,
  useRouteInfo,
  useInfiniteUserModels,
} from "../../lib";
import { useSearchParams } from "next/navigation";
import { ModelsList } from "./ModelsList";
import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { ModelsListPagination } from "./ModelsListPagination";

export type ModelHubListPageMainViewProps = GeneralAppPageProp;

export const ModelHubListPageMainView = (
  props: ModelHubListPageMainViewProps
) => {
  const { router, enableQuery, accessToken } = props;
  const searchParams = useSearchParams();
  const visibility = searchParams.get("visibility");
  const [pageNumber, setPageNumber] = useState(0);
  const routeInfo = useRouteInfo();

  const [searchCode, setSearchCode] = React.useState<string>("");
  const [searchInputValue, setSearchInputValue] = React.useState<string>("");
  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    []
  );

  const [selectedVisibilityOption, setSelectedVisibilityOption] =
    React.useState<Visibility>(
      visibility === "VISIBILITY_PUBLIC"
        ? "VISIBILITY_PUBLIC"
        : "VISIBILITY_UNSPECIFIED"
    );

  useEffect(() => {
    setPageNumber(0);
  }, [selectedVisibilityOption, searchCode]);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const models = useInfiniteUserModels({
    userName: routeInfo.data.namespaceName,
    enabled: routeInfo.isSuccess && enableQuery,
    accessToken,
    filter: searchCode ? `q="${searchCode}"` : null,
    visibility: selectedVisibilityOption ?? null,
  });

  const isLoadingResource =
    !models.isFetched ||
    models.isLoading ||
    models.isFetching ||
    models.isFetchingNextPage;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="mx-auto flex max-w-7xl flex-col px-12">
      <div className="mb-4 flex flex-row items-end gap-x-3">
        <div className="flex w-[300px] flex-col gap-y-2.5">
          <p className="text-semantic-fg-primary product-body-text-3-semibold">
            Search Models
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
            <Select.Trigger className="mt-auto w-full">
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
        <Button
          className="ml-auto gap-x-2"
          variant="primary"
          size="lg"
          onClick={() => {
            router.push(`/${routeInfo.data.namespaceId}/models/create`);
          }}
        >
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Create Model
        </Button>
      </div>
      <ModelsList
        models={models.isSuccess ? models.data.pages[pageNumber]?.models : []}
        onModelDelete={models.refetch}
        isLoading={isLoadingResource}
        isSearchActive={!!searchCode}
      />
      <ModelsListPagination
        models={models}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
      />
    </div>
  );
};
