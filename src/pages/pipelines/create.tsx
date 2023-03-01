import { FC, ReactElement, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { CreatePipelineForm } from "@/components/pipeline";
import {
  PageTitle,
  PageHead,
  PageBase,
  PageContentContainer,
} from "@/components/ui";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";
import { env } from "@/utils";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE") === "true") {
    return {
      redirect: {
        destination: "/pipelines",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

const CreatePipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const [stepNumber, setStepNumber] = useState(0);

  const currentPage = useMemo(() => {
    switch (stepNumber) {
      case 0:
        return {
          title: "Set up source",
          breadcrumbs: ["Pipeline", "Source setting"],
        };
      case 1:
        return {
          title: "Set up source",
          breadcrumbs: ["Pipeline", "Source setting"],
        };
      case 2:
        return {
          title: "Set up Model",
          breadcrumbs: ["Pipeline", "Model setting"],
        };
      case 3:
        return {
          title: "Set up Destination",
          breadcrumbs: ["Pipeline", "Destination setting"],
        };
      case 4:
        return {
          title: "Set up Pipeline",
          breadcrumbs: ["Pipeline", "Pipeline setting"],
        };
    }
  }, [stepNumber]);

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_create_pipeline_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="Create pipeline" />
      <PageContentContainer>
        <PageTitle
          title={currentPage ? currentPage.title : ""}
          breadcrumbs={currentPage ? currentPage.breadcrumbs : ["Pipeline"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <CreatePipelineForm
          stepNumber={stepNumber}
          setStepNumber={setStepNumber}
          maximumStepNumber={4}
        />
      </PageContentContainer>
    </>
  );
};

CreatePipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreatePipelinePage;
