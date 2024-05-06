"use client";

import dynamic from "next/dynamic";
import { Button, Input, Icons, Select } from "@instill-ai/design-system";
import { GeneralAppPageProp, Visibility, useModels, useWatchUserModels } from "../../lib";
import { useParams, useSearchParams } from "next/navigation";
import { ModelsList } from "./ModelsList";
import React from "react";

const ModelsTable = dynamic(
  () => import("./ModelsTable").then((mod) => mod.ModelsTable),
  { ssr: false }
);

export type ModelHubListPageMainViewProps = GeneralAppPageProp;

export const ModelHubListPageMainView = (
  props: ModelHubListPageMainViewProps
) => {
  const { router, enableQuery, accessToken } = props;
  const { entity } = useParams();
  const searchParams = useSearchParams();
  const visibility = searchParams.get("visibility");

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
  });
  const modelsWatchState = useWatchUserModels({
    modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
    enabled: enableQuery && models.isSuccess && models.data.length > 0,
    accessToken,
  });
  const isLoadingResource =
    models.isLoading || (models.isSuccess && models.data.length > 0)
      ? modelsWatchState.isLoading
      : false;
  console.log(models.data);
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
                value={/* searchInputValue ?? */ ""}
                placeholder="Search..."
                onChange={(event) => {
                  //setSearchInputValue(event.target.value);
                  //debouncedSetSearchCode(event.target.value);
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
        models={models.isSuccess ? models.data : []}
        accessToken={accessToken}
        onModelDelete={models.refetch}
      />
      {/* <ModelsTable
        models={models.isSuccess ? models.data : []}
        modelsWatchState={
          modelsWatchState.isSuccess ? modelsWatchState.data : {}
        }
        isError={models.isError || modelsWatchState.isError}
        isLoading={isLoadingResource}
      /> */}
    </div>
  );
};
