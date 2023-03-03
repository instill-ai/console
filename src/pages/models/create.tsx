import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import {
  PageTitle,
  PageHead,
  PageBase,
  PageContentContainer,
} from "@/components/ui";
import { CreateModelForm } from "@/components/model";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";
import { env } from "@/utils";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE") === "true") {
    return {
      redirect: {
        destination: "/models",
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

const CreateModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_create_model_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="Create model" />
      <PageContentContainer>
        <PageTitle
          title="Set Up New Model"
          breadcrumbs={["Model", "Settings"]}
          displayButton={false}
          marginBottom="mb-10"
        />
        <CreateModelForm />
      </PageContentContainer>
    </>
  );
};

CreateModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateModelPage;
