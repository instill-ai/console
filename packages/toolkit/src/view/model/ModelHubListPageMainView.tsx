"use client";

import dynamic from "next/dynamic";
import { Button, Icons } from "@instill-ai/design-system";
import { GeneralAppPageProp, useModels, useWatchUserModels } from "../../lib";
import { useParams } from "next/navigation";

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

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <Button
          className="gap-x-2"
          variant="primary"
          size="lg"
          onClick={() => {
            router.push(`/${entity}/models/create`);
          }}
        >
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Add Model
        </Button>
      </div>
      <ModelsTable
        models={models.isSuccess ? models.data : []}
        modelsWatchState={
          modelsWatchState.isSuccess ? modelsWatchState.data : {}
        }
        isError={models.isError || modelsWatchState.isError}
        isLoading={isLoadingResource}
      />
    </div>
  );
};
