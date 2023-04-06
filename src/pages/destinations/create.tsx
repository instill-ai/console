import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import {
  useSendAmplitudeData,
  useWarnUnsavedChanges,
  CreateDestinationForm,
  useCreateResourceFormStore,
  type CreateResourceFormStore,
  env,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE") === "true") {
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
});

const CreateDestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { formIsDirty, createNewResourceIsComplete } =
    useCreateResourceFormStore(selector, shallow);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: createNewResourceIsComplete ? false : formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: null,
  });

  useSendAmplitudeData(
    "hit_create_destination_page",
    { type: "navigation" },
    router.isReady
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
          title={null}
          formLess={false}
          marginBottom={null}
          onCreate={() => router.push("/destinations")}
          initStoreOnCreate={true}
          accessToken={null}
        />
      </PageContentContainer>
    </>
  );
};

CreateDestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateDestinationPage;
