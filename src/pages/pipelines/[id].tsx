import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { PageBase, PageContentContainer } from "@/components/layouts";
import { usePipeline } from "@/services/pipeline";
import {
  PipelineTable,
  StateLabel,
  PipelineModeLabel,
  PageTitle,
} from "@/components/ui";
import ConfigurePipelineForm from "@/components/forms/pipeline/ConfigurePipelineForm";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";

// export const getServerSideProps: GetServerSideProps = async () => {
//   const data = await listRepoFileContent(
//     "instill-ai",
//     "pipeline-backend",
//     "config/models/pipeline.json"
//   );

//   const decodeSchema = Buffer.from(data.content, "base64").toString();
//   const jsonSchema = JSON.parse(decodeSchema);

//   const fields = transformSchemaToFormFields(jsonSchema);

//   console.log(fields);

//   return {
//     props: {
//       fields,
//     },
//   };
// };

interface GetLayOutProps {
  page: ReactElement;
}

const PipelineDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  const pipeline = usePipeline(id ? `pipelines/${id.toString()}` : null);

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_pipeline_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead
        title={
          pipeline.isLoading
            ? ""
            : (("Pipeline | " + pipeline.data?.id) as string)
        }
      />
      <PageContentContainer>
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Pipeline", id.toString()] : ["Pipeline"]}
          enableButton={false}
          marginBottom="mb-5"
        />
        <div className="mb-10 flex flex-row gap-x-2.5">
          <PipelineModeLabel
            enableBgColor={true}
            enableIcon={true}
            iconWidth="w-[18px]"
            iconHeight="h-[18px]"
            iconPosition="my-auto"
            paddingX="px-[5px]"
            paddingY="py-1.5"
            mode={pipeline.data?.mode || "MODE_UNSPECIFIED"}
          />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            iconWidth="w-[18px]"
            iconHeight="h-[18px]"
            iconPosition="my-auto"
            paddingX="px-[5px]"
            paddingY="py-1.5"
            state={pipeline.data?.state || "STATE_UNSPECIFIED"}
          />
        </div>
        <PipelineTable
          pipeline={pipeline.isSuccess ? pipeline.data : null}
          isLoading={false}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Settings</h3>
        <ConfigurePipelineForm
          pipeline={pipeline.isSuccess ? pipeline.data : null}
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelineDetailsPage;
