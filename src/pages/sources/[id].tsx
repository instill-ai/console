import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { PageBase, PageContentContainer } from "@/components/layouts";
import { StateLabel, PipelinesTable, PageTitle } from "@/components/ui";
import { useSourceWithPipelines } from "@/services/connector";
import { ConfigureSourceForm } from "@/components/forms";
import { useMultiStageQueryLoadingState } from "@/hooks/useMultiStageQueryLoadingState";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";

// export const getServerSideProps: GetServerSideProps = async () => {
//   const data = await listRepoFileContent(
//     "instill-ai",
//     "connector-backend",
//     "config/models/source_connector_definition.json"
//   );

//   const decodeSchema = Buffer.from(data.content, "base64").toString();
//   const jsonSchema = JSON.parse(decodeSchema);

//   console.log(jsonSchema);

//   return {
//     props: {
//       schema: jsonSchema,
//     },
//   };
// };

interface GetLayOutProps {
  page: ReactElement;
}

// export type SourceDetailsPageProps = {};

const SourceDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  const sourceWithPipelines = useSourceWithPipelines(
    id ? `source-connectors/${id.toString()}` : null
  );

  const isLoading = useMultiStageQueryLoadingState({
    data: sourceWithPipelines.data,
    isError: sourceWithPipelines.isError,
    isSuccess: sourceWithPipelines.isSuccess,
    isLoading: sourceWithPipelines.isLoading,
  });

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_source_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <PageContentContainer>
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={id ? ["Data Source", id.toString()] : ["Data Source"]}
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
          sourceWithPipelines.data ? sourceWithPipelines.data.pipelines : []
        }
        isLoadingPipeline={isLoading}
        marginBottom="mb-10"
        enablePlaceholderCreateButton={false}
      />
      <h3 className="instill-text-h3 mb-5 text-black">Settings</h3>
      <div>
        <ConfigureSourceForm
          source={sourceWithPipelines.data ? sourceWithPipelines.data : null}
        />
      </div>
    </PageContentContainer>
  );
};

SourceDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default SourceDetailsPage;
