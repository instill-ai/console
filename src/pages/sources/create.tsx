import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { CreateSourceForm } from "@/components/source";
import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";
import { env } from "@/utils";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE") === "true") {
    return {
      redirect: {
        destination: "/sources",
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

const CreateSourcePage: FC & {
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
    "hit_create_source_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="Create source-connector" />
      <PageContentContainer>
        <PageTitle
          title="Set Up New Source"
          breadcrumbs={["Source", "Source Settings"]}
          displayButton={false}
          marginBottom="mb-10"
        />
        <CreateSourceForm marginBottom={null} />
      </PageContentContainer>
    </>
  );
};

CreateSourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateSourcePage;
