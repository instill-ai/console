import { LinkButton } from "@instill-ai/design-system";

export const ResourceNotCreatedWarning = ({
  onCreate,
  disabled,
}: {
  onCreate: () => void;
  disabled?: boolean;
}) => {
  return (
    <div className="mb-3 w-full gap-y-2 rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
      <p className="text-semantic-fg-primary product-body-text-3-regular">
        Please create a connector for this component
      </p>
      <LinkButton
        className="gap-x-2"
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
