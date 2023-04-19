import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useSourceWithPipelines,
  useSendAmplitudeData,
  ConfigureSourceForm,
  StateLabel,
  PipelinesTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchPipelines,
  useWatchSource,
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

const SourceDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const sourceWithPipelines = useSourceWithPipelines({
    sourceName: id ? `source-connectors/${id.toString()}` : null,
    accessToken: null,
    enable: true,
  });

  const sourceWatchState = useWatchSource({
    sourceName: sourceWithPipelines.isSuccess
      ? sourceWithPipelines.data.name
      : null,
    accessToken: null,
    enable: sourceWithPipelines.isSuccess,
  });

  const pipelinesWatchState = useWatchPipelines({
    pipelineNames: sourceWithPipelines.isSuccess
      ? sourceWithPipelines.data.pipelines.map((pipeline) => pipeline.name)
      : [],
    accessToken: null,
    enable: sourceWithPipelines.isSuccess,
  });

  useSendAmplitudeData(
    "hit_source_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead
        title={
          sourceWithPipelines.isLoading
            ? ""
            : (sourceWithPipelines.data?.name as string)
        }
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
            state={
              sourceWatchState.isSuccess
                ? sourceWatchState.data.state
                : "STATE_UNSPECIFIED"
            }
            iconHeight="h-[18px]"
            iconWidth="w-[18px]"
            iconPosition="my-auto"
          />
        </div>
        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={
            sourceWithPipelines.data ? sourceWithPipelines.data.pipelines : []
          }
          pipelinesWatchState={
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : null
          }
          isError={sourceWithPipelines.isError || pipelinesWatchState.isError}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {sourceWithPipelines.isSuccess && sourceWithPipelines.data ? (
          <ConfigureSourceForm
            width="w-full"
            source={sourceWithPipelines.data}
            marginBottom={null}
            onDelete={() => {
              router.push("/sources");
            }}
            disableDelete={enableGuard}
            accessToken={null}
            disableConfigure={true}
          />
        ) : null}
      </PageContentContainer>
    </>
  );
};

SourceDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default SourceDetailsPage;
