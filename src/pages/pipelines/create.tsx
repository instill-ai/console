import { GetServerSideProps } from "next";
import { FC, ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import {
  useWarnUnsavedChanges,
  CreatePipelineForm,
  useCreateResourceFormStore,
  CreateResourceFormStore,
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

const selector = (state: CreateResourceFormStore) => ({
  formIsDirty: state.formIsDirty,
  createNewResourceIsComplete: state.createNewResourceIsComplete,
  pipelineFormStep: state.pipelineFormStep,
  init: state.init,
});

const CreatePipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();

  /* -------------------------------------------------------------------------
   * Prepare form data
   * -----------------------------------------------------------------------*/

  const { formIsDirty, createNewResourceIsComplete, pipelineFormStep, init } =
    useCreateResourceFormStore(selector, shallow);

  const currentPage = useMemo(() => {
    switch (pipelineFormStep) {
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
  }, [pipelineFormStep]);

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
      <PageHead title="Create pipeline" />
      <PageContentContainer>
        <PageTitle
          title={currentPage ? currentPage.title : ""}
          breadcrumbs={currentPage ? currentPage.breadcrumbs : ["Pipeline"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <CreatePipelineForm
          onCreate={() => {
            router.push("/pipelines");
          }}
          accessToken={null}
          syncModelOnly={false}
          withModelPreset={false}
          enabledQuery={true}
        />
      </PageContentContainer>
    </>
  );
};

CreatePipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreatePipelinePage;
