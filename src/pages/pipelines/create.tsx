import { FC, ReactElement, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { CreatePipelineForm } from "@/components/forms";
import { PageBase, PageContentContainer } from "@/components/layouts";
import { PageTitle } from "@/components/ui";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";

interface GetLayOutProps {
  page: ReactElement;
}

const CreatePipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const [stepNumber, setStepNumber] = useState(0);

  const currentPage = useMemo(() => {
    switch (stepNumber) {
      case 0:
        return {
          title: "Choose Pipeline Type",
          breadcrumbs: ["Pipeline", "Source setting"],
        };
      case 1:
        return {
          title: "Set Up source",
          breadcrumbs: ["Pipeline", "Source setting"],
        };
      case 2:
        return {
          title: "Set Up Model",
          breadcrumbs: ["Pipeline", "Model setting"],
        };
      case 3:
        return {
          title: "Set Up Destination",
          breadcrumbs: ["Pipeline", "Destination setting"],
        };
      case 4:
        return {
          title: "Set Up Pipeline",
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
