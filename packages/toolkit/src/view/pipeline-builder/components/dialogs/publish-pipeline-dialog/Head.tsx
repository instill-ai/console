"use client";

import { Button, Icons } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../../lib";

const selector = (store: InstillStore) => ({
  updateDialogPublishPipelineIsOpen: store.updateDialogPublishPipelineIsOpen,
});

export const Head = ({
  entity,
  id,
}: {
  entity: Nullable<string>;
  id: Nullable<string>;
}) => {
  const { updateDialogPublishPipelineIsOpen } = useInstillStore(
    useShallow(selector)
  );

  return (
    <div className="flex flex-row px-8 py-2">
      <div className="mr-auto flex flex-row gap-x-1">
        <Icons.Pipeline className="my-auto h-5 w-5 stroke-semantic-accent-default" />
        <p className="my-auto text-semantic-accent-default product-body-text-3-semibold">
          {entity}
        </p>
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            d="M6.45117 18.3337L14.7845 1.66699"
            stroke="#1D2433"
            strokeOpacity="0.65"
            strokeWidth="1.5"
            strokeLinecap="round"
            stroke-Linejoin="round"
          />
        </svg>
        <p className="my-auto text-semantic-fg-primary product-body-text-3-regular">
          {id}
        </p>
      </div>
      <div className="flex flex-row gap-x-4">
        <Button
          type="button"
          variant="secondaryGrey"
          size="lg"
          onClick={() => {
            updateDialogPublishPipelineIsOpen(() => false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Publish Pipeline
        </Button>
      </div>
    </div>
  );
};
