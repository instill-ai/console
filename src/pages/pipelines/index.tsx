import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { PipelinesTable } from "@/services/pipeline";
import { usePipelines } from "@/services/pipeline/PipelineServices";
import { FC, ReactElement } from "react";

interface GetLayOutProps {
  page: ReactElement;
}

// export type PipelinePageProps = {};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const pipelines = usePipelines(true);

  return (
    <PageContentContainer>
      <PageTitle
        title="Pipeline"
        breadcrumbs={["Pipeline"]}
        enableButton={
          pipelines.data ? (pipelines.data.length === 0 ? false : true) : false
        }
        buttonName="Add new pipeline"
        buttonLink="/pipelines/create"
        marginBottom="mb-10"
      />
      <PipelinesTable
        pipelines={pipelines.data ? pipelines.data : []}
        isLoadingPipeline={pipelines.isLoading}
        marginBottom={null}
      />
    </PageContentContainer>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
