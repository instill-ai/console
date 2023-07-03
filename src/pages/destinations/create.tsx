import { FC, ReactElement } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import {
  env,
  useWarnUnsavedChanges,
  CreateDestinationForm,
  useCreateResourceFormStore,
  type CreateResourceFormStore,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
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

const selector = (state: CreateResourceFormStore) => ({
  formIsDirty: state.formIsDirty,
  createNewResourceIsComplete: state.createNewResourceIsComplete,
  init: state.init,
});

const CreateDestinationPage: FC & {
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
      <PageHead title="Create destination-connector" />
      <div className="flex flex-col">
        <PageTitle
          title="Set Up New Destination"
          breadcrumbs={["Destination", "Destination Settings"]}
          disabledButton={true}
          marginBottom="mb-10"
        />
        <CreateDestinationForm
          title={null}
          onCreate={(_, initStore) => {
            initStore();
            router.push("/destinations");
          }}
          accessToken={null}
          enabledQuery={true}
        />
      </div>
    </>
  );
};

CreateDestinationPage.getLayout = (page) => {
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

export default CreateDestinationPage;
