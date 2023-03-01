import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { CreateDestinationForm } from "@/components/destination";
import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";

export const getServerSideProps: GetServerSideProps = async () => {
  if (
    process.env.NEXT_PUBLIC_DISABLE_CREATE_DELETE_UPDATE_RESOURCE === "true"
  ) {
    return {
      redirect: {
        destination: "/destinations",
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
      <PageHead title="Create destination-connector" />
      <PageContentContainer>
        <PageTitle
          title="Set Up New Destination"
          breadcrumbs={["Destination", "Destination Settings"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <CreateDestinationForm
          flex1={false}
          onSuccessCb={() => router.push("/destinations")}
          setResult={null}
          title={null}
          padding={null}
          marginBottom={null}
          pipelineMode={null}
        />
      </PageContentContainer>
    </>
  );
};

CreateDestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateDestinationPage;
