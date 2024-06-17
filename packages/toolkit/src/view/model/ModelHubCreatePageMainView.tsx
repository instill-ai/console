"use client";

import { CreateModelForm } from "./CreateModelForm";

export const ModelHubCreatePageMainView = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col px-12">
      <div className="mb-10 flex border-b border-semantic-bg-line">
        <h2 className="mb-5 text-[22px] font-semibold text-semantic-fg-primary">
          Create a model
        </h2>
      </div>
      <CreateModelForm />
    </div>
  );
};
