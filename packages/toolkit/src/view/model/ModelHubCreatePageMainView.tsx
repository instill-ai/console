"use client";

import { useParams } from "next/navigation";
import { PageTitle } from "../../components";
import { GeneralAppPageProp } from "../../lib";
import { CreateModelForm } from "./CreateModelForm";
import { CreateModelForm as CreateModelForm1 } from "./CreateModelForm1";

export type ModelHubCreatePageMainViewProps = GeneralAppPageProp & {
  disabledCreateModel: boolean;
};

export const ModelHubCreatePageMainView = (
  props: ModelHubCreatePageMainViewProps
) => {
  const { accessToken, enableQuery, router, disabledCreateModel } = props;
  const { entity } = useParams();

  return (
    <div className="flex flex-col">
      <PageTitle
        title="Set Up New Model"
        breadcrumbs={["Models", "Model Settings"]}
        className="mb-10"
      />
      <CreateModelForm1
        accessToken={accessToken}
        enabledQuery={enableQuery}
      />
      <CreateModelForm
        width="w-full"
        onCreate={(initStore) => {
          initStore();
          router.push(`/${entity}/models`);
        }}
        accessToken={accessToken}
        enabledQuery={enableQuery}
        disabledCreateModel={disabledCreateModel}
      />
    </div>
  );
};
