import { FC, ReactElement, useMemo } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { usePipeline } from "@/services/pipeline";
import { useRouter } from "next/router";
import PipelineOverViewTable from "@/services/pipeline/PipelineOverviewTable";
import { mockPipelines, Pipeline } from "@/services/pipeline/PipelineServices";
import ModelLabel from "@/components/ui/ModeLabel/ModeLabel";
import { StatusLabel } from "@/components/ui";

// export type PipelineDetailsPageProps = {}

interface GetLayOutProps {
  page: ReactElement;
}

const PipelineDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const pipeline = usePipeline(id && id.toString());

  return (
    <PageContentContainer>
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={id ? ["Pipeline", id.toString()] : ["Pipeline"]}
        enableButton={false}
        marginBottom="mb-5"
      />

      {pipeline.isSuccess ? (
        <>
          <div className="mb-10 flex flex-row gap-x-2.5">
            <ModelLabel
              enableBgColor={true}
              enableIcon={true}
              iconWidth="w-[18px]"
              iconHeight="h-[18px]"
              iconPosition="my-auto"
              paddingX="px-[5px]"
              paddingY="py-1.5"
              mode={pipeline.data.mode}
              label={pipeline.data.mode}
            />
            <StatusLabel
              enableBgColor={true}
              enableIcon={true}
              iconWidth="w-[18px]"
              iconHeight="h-[18px]"
              iconPosition="my-auto"
              paddingX="px-[5px]"
              paddingY="py-1.5"
              status={pipeline.data.status}
              label={pipeline.data.mode}
            />
          </div>
          <PipelineOverViewTable pipeline={pipeline.data} isLoading={false} />
        </>
      ) : null}
    </PageContentContainer>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelineDetailsPage;
