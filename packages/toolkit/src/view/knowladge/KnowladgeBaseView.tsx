"use client";

import dynamic from "next/dynamic";
import { Button, Icons } from "@instill-ai/design-system";
import { GeneralAppPageProp, useModels, useWatchUserModels } from "../../lib";
import { useParams } from "next/navigation";

export type KnowladgeBaseViewProps = GeneralAppPageProp;

export const KnowladgeBaseView = (
  props: KnowladgeBaseViewProps
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
        >
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Init
        </Button>
      </div>
    </div>
  );
};
