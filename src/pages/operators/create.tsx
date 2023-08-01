import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import {
  useWarnUnsavedChanges,
  CreateSourceForm,
  useCreateResourceFormStore,
  env,
  type CreateResourceFormStore,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
    return {
      redirect: {
        destination: "/operators",
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

const CreateSourcePage: FC & {
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
      <PageHead title="Create source-connector" />
      <div className="flex flex-col">
        <PageTitle
          title="Set Up New Source"
          breadcrumbs={["Source", "Source Settings"]}
          disabledButton={true}
          marginBottom="mb-10"
        />
        <CreateSourceForm
          onCreate={(initStore) => {
            initStore();
            router.push("/operators");
          }}
          accessToken={null}
          width="w-full"
          enabledQuery={true}
        />
      </div>
    </>
  );
};

CreateSourcePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreateSourcePage;
