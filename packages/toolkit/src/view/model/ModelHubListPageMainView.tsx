"use client";

import { Button, Input, Icons, Select, Nullable } from "@instill-ai/design-system";
import { GeneralAppPageProp, Visibility, useModels } from "../../lib";
import { useParams, useSearchParams } from "next/navigation";
import { ModelsList } from "./ModelsList";
import React, { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Pagination } from "@instill-ai/design-system";
import { env } from "../../server";

export type ModelHubListPageMainViewProps = GeneralAppPageProp;

const defaultPaginationProps = {
  isPrevDisabled: true,
  isNextDisabled: true,
  currentPage: 0,
  totalPages: 0,
}

export const ModelHubListPageMainView = (
  props: ModelHubListPageMainViewProps
) => {
  const { router, enableQuery, accessToken } = props;
  const { entity } = useParams();
  const searchParams = useSearchParams();
  const visibility = searchParams.get("visibility");
  const [pageNumber, setPageNumber] = useState(0)

  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);
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

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const models = useModels({
    enabled: enableQuery,
    accessToken,
    filter: searchCode ? `q="${searchCode}"` : null,
    visibility: selectedVisibilityOption ?? null,
  });

  const isLoadingResource = !models.isFetched || models.isLoading || models.isFetching || models.isFetchingNextPage;

  const paginationProps = useMemo(() => {
    if (!models.data || models.data.pages.length === 0) {
      return defaultPaginationProps;
    }

    const pageSize = env("NEXT_PUBLIC_QUERY_PAGE_SIZE") || 10;
    const totalPages = Math.ceil(models.data.pages[0].total_size / pageSize);

    let isNextDisabled = true;

    if (models.hasNextPage || pageNumber < totalPages - 1) {
      isNextDisabled = false;
    }

    return {
      isPrevDisabled: pageNumber === 0,
      isNextDisabled,
      currentPage: pageNumber + 1,
      totalPages,
    }
  }, [models, pageNumber])

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-row items-end gap-x-3">
        <div className="flex flex-col gap-y-2.5">
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
              />
            </Input.Root>
          </div>
        </div>
        <div className="flex flex-col gap-y-2.5 min-w-52">
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
                <Select.Item value="VISIBILITY_UNSPECIFIED">All</Select.Item>
                <Select.Item value="VISIBILITY_PUBLIC">Public</Select.Item>
                <Select.Item value="VISIBILITY_PRIVATE">Private</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Button
          className="ml-auto"
          variant="primary"
          size="lg"
          onClick={() => {
            router.push(`/${entity}/models/create`);
          }}
        >
          Create a Model
        </Button>
      </div>
      <ModelsList
        models={models.isSuccess ? (models.data?.pages[pageNumber] ? models.data?.pages[pageNumber].models : []) : []}
        accessToken={accessToken}
        onModelDelete={models.refetch}
        isLoading={isLoadingResource}
      />
      {
        models.data && paginationProps.totalPages > 1
          ? (
            <Pagination
              align="center"
              onPrev={() => setPageNumber(currentNumber => currentNumber - 1)}
              onNext={() => {
                setPageNumber(currentNumber => {
                  const newCurrentNumber = currentNumber + 1;
                  
                  if (
                    paginationProps.currentPage < paginationProps.totalPages &&
                    !models.data.pages[newCurrentNumber]
                  ) {
                    models.fetchNextPage();
                  }

                  return newCurrentNumber;
                });
              }}
              {...paginationProps}
            />
          ) : null
      }
    </div>
  );
};
