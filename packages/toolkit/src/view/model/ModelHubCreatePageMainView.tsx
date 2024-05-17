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
    <div className="flex flex-col">
      <div className="mb-10 flex border-b border-semantic-bg-line">
        <h2 className="text-instill-h2 mb-5 text-black">Create a model</h2>
      </div>
      <CreateModelForm accessToken={accessToken} enabledQuery={enableQuery} />
    </div>
  );
};
