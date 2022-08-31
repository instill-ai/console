import { FC, ReactElement, useMemo } from "react";
import { useRouter } from "next/router";

import {
  StateLabel,
  PipelinesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { ConfigureDestinationForm } from "@/components/destination";
import { useMultiStageQueryLoadingState } from "@/hooks/useMultiStageQueryLoadingState";
import { useDestinationWithPipelines } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  const destinationWithPipelines = useDestinationWithPipelines(
    id ? `destination-connectors/${id.toString()}` : null
  );

  const destination = useMemo(() => {
    if (!destinationWithPipelines.isSuccess) return null;
    const { pipelines, ...destination } = destinationWithPipelines.data;
    return destination;
  }, [destinationWithPipelines.isSuccess, destinationWithPipelines.data]);

  const isLoading = useMultiStageQueryLoadingState({
    data: destinationWithPipelines.data,
    isError: destinationWithPipelines.isError,
    isSuccess: destinationWithPipelines.isSuccess,
    isLoading: destinationWithPipelines.isLoading,
  });

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_destination_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead
        title={isLoading ? "" : (destinationWithPipelines.data?.name as string)}
      />
      <PageContentContainer>
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Destination", id.toString()] : ["Destination"]}
          enableButton={false}
          marginBottom="mb-[50px]"
        />
        <div className="mb-10 flex flex-row gap-x-5">
          <h3 className="my-auto text-black text-instill-h3">State</h3>
          <StateLabel
            enableIcon={true}
            enableBgColor={true}
            state={
              destinationWithPipelines.data?.connector.state ??
              "STATE_UNSPECIFIED"
            }
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
            destinationWithPipelines.data
              ? destinationWithPipelines.data.pipelines
              : []
          }
          isLoadingPipeline={isLoading}
          marginBottom="mb-10"
          enablePlaceholderCreateButton={false}
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <div>
          {destination ? (
            <ConfigureDestinationForm destination={destination} />
          ) : null}
        </div>
      </PageContentContainer>
    </>
  );
};

DestinationDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default DestinationDetailsPage;
