"use client";

import type { Visibility } from "instill-sdk";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

import { Button, Icons, Input } from "@instill-ai/design-system";

import {
  InstillStore,
  useInfiniteNamespaceModels,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { ModelsList } from "./ModelsList";
import { ModelsListPagination } from "./ModelsListPagination";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ModelHubListPageMainView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visibility = searchParams.get("visibility");
  const [pageNumber, setPageNumber] = React.useState(0);
  const routeInfo = useRouteInfo();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const [searchCode, setSearchCode] = React.useState<string>("");
  const [searchInputValue, setSearchInputValue] = React.useState<string>("");
  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    [],
  );

  const [selectedVisibilityOption] = React.useState<Visibility>(
    visibility === "VISIBILITY_PUBLIC"
      ? "VISIBILITY_PUBLIC"
      : "VISIBILITY_UNSPECIFIED",
  );

  React.useEffect(() => {
    setPageNumber(0);
  }, [selectedVisibilityOption, searchCode]);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const models = useInfiniteNamespaceModels({
    namespaceId: routeInfo.isSuccess ? routeInfo.data.namespaceId : null,
    enabled: routeInfo.isSuccess && enabledQuery,
    accessToken,
    filter: searchCode ? `q="${searchCode}"` : null,
    visibility: selectedVisibilityOption ?? null,
    orderBy: null,
    view: "VIEW_FULL",
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
    <div className="flex flex-col">
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
        {/* <div className="flex w-[300px] min-w-52 flex-col gap-y-2.5">
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
        </div> */}
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
        models={
          models.isSuccess ? (models.data.pages[pageNumber]?.models ?? []) : []
        }
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
