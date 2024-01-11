import * as React from "react";
import { LoadingSpin } from "../../../components";

export type PipelineDescriptionProps = {
  editor: React.ReactNode;
  hasUnsavedChanges: boolean;
};

export const PipelineDescription = ({
  editor,
  hasUnsavedChanges,
}: PipelineDescriptionProps) => {
  return (
    <div className="flex w-full flex-1 flex-col">
      {editor}
      {hasUnsavedChanges ? (
        <div className="ml-auto flex gap-x-2">
          <div>
            <LoadingSpin className="!text-semantic-fg-disabled" />
          </div>
          <p className="my-auto text-semantic-fg-disabled product-body-text-4-medium">
            Have unsaved changes
          </p>
        </div>
      ) : null}
    </div>
  );
};
