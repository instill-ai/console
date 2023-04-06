import { FC, ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import {
  useDestinationWithPipelines,
  useSendAmplitudeData,
  useWarnUnsavedChanges,
  ConfigureDestinationForm,
  useCreateResourceFormStore,
  PipelinesTable,
  StateLabel,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const formIsDirty = useCreateResourceFormStore((state) => state.formIsDirty);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: null,
  });

  const destinationWithPipelines = useDestinationWithPipelines({
    destinationName: id ? `destination-connectors/${id.toString()}` : null,
    accessToken: null,
    enable: true,
  });

  const destination = useMemo(() => {
    if (!destinationWithPipelines.isSuccess) return null;
    const { pipelines, ...destination } = destinationWithPipelines.data;
    return destination;
  }, [destinationWithPipelines.isSuccess, destinationWithPipelines.data]);

  useSendAmplitudeData(
    "hit_destination_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead
        title={
          destinationWithPipelines.isLoading
            ? ""
            : (destinationWithPipelines.data?.name as string)
        }
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
          />
        </div>
        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={
            destinationWithPipelines.data
              ? destinationWithPipelines.data.pipelines
              : []
          }
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <div>
          {destination ? (
            <ConfigureDestinationForm
              destination={destination}
              onDelete={() => router.push("/destinations")}
              onConfigure={null}
              initStoreOnConfigure={true}
              width="w-full"
              accessToken={null}
            />
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
