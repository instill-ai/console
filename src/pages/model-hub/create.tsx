import { GetServerSideProps } from "next";
import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { env, ModelHubCreatePageMainView } from "@instill-ai/toolkit";

import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { Logo } from "@instill-ai/design-system";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
    return {
      redirect: {
        destination: "/model-hub",
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

  return (
    <>
      <PageHead title="Create model" />
      <ModelHubCreatePageMainView
        router={router}
        accessToken={null}
        enableQuery={true}
      />
    </>
  );
};

CreateModelPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreateModelPage;
