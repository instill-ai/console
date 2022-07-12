import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { CreateDestinationForm } from "@/components/forms";
import { PageBase, PageContentContainer } from "@/components/layouts";
import { PageTitle } from "@/components/ui";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";

interface GetLayOutProps {
  page: ReactElement;
}

const CreateDestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_create_destination_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="Create Destination" />
      <PageContentContainer>
        <PageTitle
          title="Set Up New Destination"
          breadcrumbs={["Data Destination", "Destination Settings"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <CreateDestinationForm setResult={null} setStepNumber={null} />
      </PageContentContainer>
    </>
  );
};

CreateDestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateDestinationPage;
