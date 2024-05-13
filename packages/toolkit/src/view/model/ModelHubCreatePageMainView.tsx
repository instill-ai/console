"use client";

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
  const { accessToken, enableQuery } = props;

  return (
    <div className="flex flex-col">
      <div className="mb-10 flex border-b border-semantic-bg-line">
        <PageTitle
          title="Create a model"
          breadcrumbs={["Models", "Model Settings"]}
          className="mb-5"
        />
      </div>
      <CreateModelForm accessToken={accessToken} enabledQuery={enableQuery} />
    </div>
  );
};
