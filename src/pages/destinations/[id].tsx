import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { useRouter } from "next/router";
import { StateLabel } from "@/components/ui";
import { PipelinesTable } from "@/services/pipeline";
import { ConfigureDestinationForm } from "@/components/forms";
import { useDestinationWithPipelines } from "@/services/connector/DestinationServices";
import { useMultiStageQueryLoadingState } from "@/services/useMultiStageQueryLoadingState";

// export const getServerSideProps: GetServerSideProps = async () => {
//   const data = await listRepoFileContent(
//     "instill-ai",
//     "connector-backend",
//     "configs/models/destination-definition.json"
//   );

//   const decodeSchema = Buffer.from(data.content, "base64").toString();
//   const jsonSchema = JSON.parse(decodeSchema);

//   //const fields = transformSchemaToFormFields(jsonSchema);

//   return {
//     props: {
//       schema: jsonSchema,
//     },
//   };
// };

interface GetLayOutProps {
  page: ReactElement;
}

export type DestinationDetailsPageProps = {
  fields: any;
};

const DestinationDetailsPage: FC<DestinationDetailsPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  const destinationWithPipelines = useDestinationWithPipelines(
    id ? `destination-connectors/${id.toString()}` : null
  );

  const isLoading = useMultiStageQueryLoadingState({
    data: destinationWithPipelines.data,
    isError: destinationWithPipelines.isError,
    isSuccess: destinationWithPipelines.isSuccess,
    isLoading: destinationWithPipelines.isLoading,
  });

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
        <StateLabel
          enableIcon={true}
          enableBgColor={true}
          state="STATE_CONNECTED"
          iconHeight="h-[18px]"
          iconWidth="w-[18px]"
          iconPosition="my-auto"
          paddingY="py-2"
          paddingX="px-2"
        />
      </div>
      <h3 className="instill-text-h3 mb-5 text-black">Overview</h3>
      <PipelinesTable
        pipelines={
          destinationWithPipelines.data
            ? destinationWithPipelines.data.pipelines
            : []
        }
        isLoadingPipeline={isLoading}
        marginBottom="mb-10"
        enablePlaceholderCreateButton={false}
      />
      <h3 className="instill-text-h3 mb-5 text-black">Settings</h3>
      <div>
        <ConfigureDestinationForm
          destination={
            destinationWithPipelines.data ? destinationWithPipelines.data : null
          }
        />
      </div>
    </PageContentContainer>
  );
};

DestinationDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default DestinationDetailsPage;
