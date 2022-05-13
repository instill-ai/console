import { FC, ReactElement } from "react";
import { GetServerSideProps } from "next";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { useRouter } from "next/router";
import { listRepoFileContent } from "@/lib/github";
import { usePipelinesHaveTargetDestination } from "@/services/pipeline/PipelineServices";
import ConnectorPipelinesTable from "@/services/connector/ConnectorPipelinesTable";
import { StatusLabel } from "@/components/ui";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await listRepoFileContent(
    "instill-ai",
    "connector-backend",
    "configs/models/destination-definition.json"
  );

  const decodeSchema = Buffer.from(data.content, "base64").toString();
  const jsonSchema = JSON.parse(decodeSchema);

  //const fields = transformSchemaToFormFields(jsonSchema);

  return {
    props: {
      schema: jsonSchema,
    },
  };
};

interface GetLayOutProps {
  page: ReactElement;
}

export type DestinationDetailsPageProps = {
  fields: any;
};

const DestinationDetailsPage: FC<DestinationDetailsPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ fields }) => {
  const router = useRouter();
  const { id } = router.query;

  const pipelines = usePipelinesHaveTargetDestination(id && id.toString());

  return (
    <PageContentContainer>
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={
          id ? ["Data Destination", id.toString()] : ["Data Destination"]
        }
        enableButton={false}
        marginBottom="mb-[50px]"
      />
      <div className="mb-5 flex flex-row gap-x-5">
        <h3 className="instill-text-h3 my-auto text-black">State</h3>
        <StatusLabel
          enableIcon={true}
          enableBgColor={true}
          status="connected"
          iconHeight="h-[18px]"
          iconWidth="w-[18px]"
          iconPosition="my-auto"
          paddingY="py-2"
          paddingX="px-2"
          label="Connected"
        />
      </div>
      <h3 className="instill-text-h3 mb-2.5 text-black">Overview</h3>
      {pipelines.isSuccess ? (
        <ConnectorPipelinesTable pipelines={pipelines.data} isLoading={false} />
      ) : null}
    </PageContentContainer>
  );
};

DestinationDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default DestinationDetailsPage;
