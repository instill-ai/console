import dynamic from "next/dynamic";
import { Button, Icons } from "@instill-ai/design-system";

import { GeneralPageProp, useModels, useWatchUserModels } from "../../lib";

const ModelsTable = dynamic(
  () => import("./ModelsTable").then((mod) => mod.ModelsTable),
  { ssr: false }
);

export type ModelHubListPageMainViewProps = GeneralPageProp;

export const ModelHubListPageMainView = (
  props: ModelHubListPageMainViewProps
) => {
  const { router, enableQuery, accessToken } = props;
  const { entity } = router.query;

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
            router.push(`/${entity}/model-hub/create`);
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
