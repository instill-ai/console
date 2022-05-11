import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { mockPipelines } from "@/services/pipeline/PipelineServices";
import { PipelinesTable } from "@/services/pipeline";
import { FC, ReactElement } from "react";

interface GetLayOutProps {
  page: ReactElement;
}

// export type PipelinePageProps = {};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Pipeline"
        breadcrumbs={["Pipeline"]}
        enableButton={true}
        buttonName="Add new pipeline"
        buttonLink="/pipelines/create"
        marginBottom="mb-10"
      />
      <PipelinesTable pipelines={mockPipelines} isLoadingPipeline={false} />
    </PageContentContainer>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
