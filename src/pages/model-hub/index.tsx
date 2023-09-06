import { FC, ReactElement } from "react";
import {
  useModels,
  useCreateUpdateDeleteResourceGuard,
  useWatchUserModels,
  ModelsTable,
} from "@instill-ai/toolkit";
import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { Button, Icons } from "@instill-ai/design-system";
import { useRouter } from "next/router";
interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const models = useModels({
    enabled: true,
    accessToken: null,
  });

  const modelsWatchState = useWatchUserModels({
    enabled: models.isSuccess,
    modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
    accessToken: null,
  });

  const isLoadingResource =
    models.isLoading || (models.isSuccess && models.data.length > 0)
      ? modelsWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="models" />
      <div className="flex flex-col">
        <div className="mb-14">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => {
              if (!enableGuard) router.push("/model-hub/create");
            }}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
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
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="p-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
