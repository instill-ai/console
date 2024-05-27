"use client";

import { GeneralAppPageProp } from "../../lib";
import { CreateModelForm } from "./CreateModelForm";

export type ModelHubCreatePageMainViewProps = GeneralAppPageProp & {
  disabledCreateModel: boolean;
};

export const ModelHubCreatePageMainView = (
  props: ModelHubCreatePageMainViewProps
) => {
  const { accessToken, enableQuery } = props;

  return (
    <div className="mx-auto flex max-w-7xl flex-col px-12">
      <div className="mb-10 flex border-b border-semantic-bg-line">
        <h2 className="mb-5 text-xl font-semibold text-semantic-fg-primary">
          Create a model
        </h2>
      </div>
      <CreateModelForm accessToken={accessToken} enabledQuery={enableQuery} />
    </div>
  );
};
