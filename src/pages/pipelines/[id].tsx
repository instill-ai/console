import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { usePipeline } from "@/services/pipeline";
import { useRouter } from "next/router";
import PipelineOverViewTable from "@/services/pipeline/PipelineOverviewTable";
import {
  StateLabel,
  PipelineModeLabel,
  TableLoadingPlaceholder,
} from "@/components/ui";
import { GetServerSideProps } from "next";
import { listRepoFileContent } from "@/lib/github";
import { transformSchemaToFormFields } from "@/services/transformation";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await listRepoFileContent(
    "instill-ai",
    "pipeline-backend",
    "config/models/pipeline.json"
  );

  const decodeSchema = Buffer.from(data.content, "base64").toString();
  const jsonSchema = JSON.parse(decodeSchema);

  const fields = transformSchemaToFormFields(jsonSchema);

  console.log(fields);

  return {
    props: {
      fields,
    },
  };
};

interface GetLayOutProps {
  page: ReactElement;
}

export type PipelineDetailsPageProps = {
  fields: string[];
};

const PipelineDetailsPage: FC<PipelineDetailsPageProps> & {
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
            <PipelineModeLabel
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
            <StateLabel
              enableBgColor={true}
              enableIcon={true}
              iconWidth="w-[18px]"
              iconHeight="h-[18px]"
              iconPosition="my-auto"
              paddingX="px-[5px]"
              paddingY="py-1.5"
              state={pipeline.data?.state}
              label={pipeline.data.mode}
            />
          </div>
          <PipelineOverViewTable pipeline={pipeline.data} isLoading={false} />
        </>
      ) : (
        <TableLoadingPlaceholder />
      )}
    </PageContentContainer>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelineDetailsPage;
