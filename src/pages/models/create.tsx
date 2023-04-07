import { shallow } from "zustand/shallow";
import { GetServerSideProps } from "next";
import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useSendAmplitudeData,
  useWarnUnsavedChanges,
  CreateResourceFormStore,
  useCreateResourceFormStore,
  CreateModelForm,
  env,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageHead,
  PageBase,
  PageContentContainer,
} from "@/components";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
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

const selector = (state: CreateResourceFormStore) => ({
  formIsDirty: state.formIsDirty,
  createNewResourceIsComplete: state.createNewResourceIsComplete,
  init: state.init,
});

const CreateModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { formIsDirty, createNewResourceIsComplete, init } =
    useCreateResourceFormStore(selector, shallow);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: createNewResourceIsComplete ? false : formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: () => {
      init();
    },
  });

  useSendAmplitudeData(
    "hit_create_model_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead title="Create model" />
      <PageContentContainer>
        <PageTitle
          title="Set Up New Model"
          breadcrumbs={["Model", "Settings"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <CreateModelForm
          onCreate={() => router.push("/models")}
          accessToken={null}
          marginBottom={null}
          initStoreOnCreate={true}
          width={null}
        />
      </PageContentContainer>
    </>
  );
};

CreateModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateModelPage;
