import { FC, ReactElement } from "react";
import {
  usePipelines,
  useCreateUpdateDeleteResourceGuard,
  PipelinesTable,
} from "@instill-ai/toolkit";
import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useRouter } from "next/router";
import { Button, Icons } from "@instill-ai/design-system";
import { usePipelineBuilderStore } from "pipeline-builder/usePipelineBuilderStore";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const pipelines = usePipelines({
    enabled: true,
    accessToken: null,
  });

  const isLoadingResource =
    pipelines.isLoading || (pipelines.isSuccess && pipelines.data.length > 0)
      ? true
      : false;

  const setPipelineId = usePipelineBuilderStore((state) => state.setPipelineId);

  const updatePipelineIsNew = usePipelineBuilderStore(
    (state) => state.updatePipelineIsNew
  );

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="pipelines" />
      <div className="flex flex-col">
        <div className="mb-14">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            disabled={enableGuard}
            onClick={() => {
              const randomName = uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: "-",
              });
              setPipelineId(randomName);
              router.push(`/pipelines/${randomName}`);
              updatePipelineIsNew(() => true);
            }}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            New Pipeline
          </Button>
        </div>

        <PipelinesTable
          pipelines={pipelines.data ? pipelines.data : []}
          isError={pipelines.isError}
          isLoading={isLoadingResource}
          accessToken={null}
        />
      </div>
    </>
  );
};

PipelinePage.getLayout = (page) => {
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

export default PipelinePage;
