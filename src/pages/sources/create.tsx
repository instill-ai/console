import { FC, ReactElement, useEffect } from "react";

import { CreateSourceForm } from "@/components/forms";
import { PageBase, PageContentContainer } from "@/components/layouts";
import { PageTitle } from "@/components/ui";
import { useRouter } from "next/router";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

interface GetLayOutProps {
  page: ReactElement;
}

const CreateSourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  useEffect(() => {
    if (router.isReady && amplitudeIsInit) {
      sendAmplitudeData("hit_create_source_page", { type: "navigation" });
    }
  }, [router.isReady, amplitudeIsInit]);

  return (
    <PageContentContainer>
      <PageTitle
        title="Set Up New Source"
        breadcrumbs={["Data Source", "Source Settings"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      <CreateSourceForm />
    </PageContentContainer>
  );
};

CreateSourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateSourcePage;
