import { shallow } from "zustand/shallow";
import { GetServerSideProps } from "next";
import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
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

  /* -------------------------------------------------------------------------
   * Prepare form data
   * -----------------------------------------------------------------------*/

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

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

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
          initStoreOnCreate={true}
          enabledQuery={true}
        />
      </PageContentContainer>
    </>
  );
};

CreateModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateModelPage;
