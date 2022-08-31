import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  StateLabel,
  PipelinesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { useSourceWithPipelines } from "@/services/connector";
import { ConfigureSourceForm } from "@/components/source";
import { useMultiStageQueryLoadingState } from "@/hooks/useMultiStageQueryLoadingState";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";

type GetLayOutProps = {
  page: ReactElement;
};

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
    <>
      <PageHead
        title={isLoading ? "" : (sourceWithPipelines.data?.name as string)}
      />
      <PageContentContainer>
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Source", id.toString()] : ["Source"]}
          enableButton={false}
          marginBottom="mb-[50px]"
        />
        <div className="mb-10 flex flex-row gap-x-5">
          <h3 className="my-auto text-black text-instill-h3">State</h3>
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
        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={
            sourceWithPipelines.data ? sourceWithPipelines.data.pipelines : []
          }
          isLoadingPipeline={isLoading}
          marginBottom="mb-10"
          enablePlaceholderCreateButton={false}
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <div>
          <ConfigureSourceForm
            source={sourceWithPipelines.data ? sourceWithPipelines.data : null}
          />
        </div>
      </PageContentContainer>
    </>
  );
};

SourceDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default SourceDetailsPage;
