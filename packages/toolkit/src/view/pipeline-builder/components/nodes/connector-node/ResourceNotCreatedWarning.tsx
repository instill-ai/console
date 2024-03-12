"use client";

import { LinkButton } from "@instill-ai/design-system";
import { Nullable } from "../../../../../lib";

export const ResourceNotCreatedWarning = ({
  connectorTitle,
  onCreate,
  disabled,
}: {
  connectorTitle: Nullable<string>;
  onCreate: () => void;
  disabled?: boolean;
}) => {
  return (
    <div className="mb-3 flex w-full flex-col gap-y-2 rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
      <p className="text-semantic-fg-primary product-body-text-3-regular">
        {`Please create or use a configured ${
          connectorTitle ? connectorTitle : ""
        } connector`}
      </p>
      <LinkButton
        className="ml-auto gap-x-2"
        variant="primary"
        size="sm"
        onClick={onCreate}
        disabled={disabled}
      >
        Create connector
      </LinkButton>
    </div>
  );
};
