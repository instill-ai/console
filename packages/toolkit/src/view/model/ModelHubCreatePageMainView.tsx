"use client";

import { useParams } from "next/navigation";
import { PageTitle } from "../../components";
import { GeneralAppPageProp } from "../../lib";
import { CreateModelForm } from "./CreateModelForm";

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
      <div className="flex border-b border-semantic-bg-line mb-10">
        <PageTitle
          title="Create a model"
          breadcrumbs={["Models", "Model Settings"]}
          className="mb-5"
        />
      </div>
      <CreateModelForm
        accessToken={accessToken}
        enabledQuery={enableQuery}
      />
    </div>
  );
};
